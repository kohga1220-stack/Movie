import * as THREE from "three";
import { continueRender, delayRender, staticFile } from "remotion";
import { useEffect, useState } from "react";
import meta from "../public/terrain/meta.json";

export const EXAG = 1.7; // 高さの強調（見やすさのため。動画内に「高さを強調」と表示する）
export const TERRAIN = meta;
export const LM = meta.landmarks as Record<"sekigahara" | "nangusan" | "matsuoyama", [number, number]>;

export type TerrainData = { heights: Int16Array; texture: THREE.Texture };

let cache: Promise<TerrainData> | null = null;
const load = (): Promise<TerrainData> => {
  cache ??= (async () => {
    const [buf, texture] = await Promise.all([
      fetch(staticFile("terrain/height.bin")).then((r) => r.arrayBuffer()),
      new Promise<THREE.Texture>((res, rej) => new THREE.TextureLoader().load(staticFile("terrain/color.png"), res, undefined, rej)),
    ]);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return { heights: new Int16Array(buf), texture };
  })();
  return cache;
};

export const useTerrainData = (): TerrainData | null => {
  const [data, setData] = useState<TerrainData | null>(null);
  const [handle] = useState(() => delayRender("terrain"));
  useEffect(() => {
    load().then((d) => {
      setData(d);
      continueRender(handle);
    });
  }, [handle]);
  return data;
};

/** 地形の高さ（強調後・メートル）。x は東、z は南。 */
export const heightAt = (heights: Int16Array, x: number, z: number): number => {
  const N = meta.grid;
  const u = x / meta.sizeMeters + meta.originPx[0];
  const v = z / meta.sizeMeters + meta.originPx[1];
  const gx = Math.min(N - 1.001, Math.max(0, u * (N - 1)));
  const gz = Math.min(N - 1.001, Math.max(0, v * (N - 1)));
  const i = Math.floor(gx);
  const j = Math.floor(gz);
  const fx = gx - i;
  const fz = gz - j;
  const h = (a: number, b: number) => heights[b * N + a] / 10;
  const y = h(i, j) * (1 - fx) * (1 - fz) + h(i + 1, j) * fx * (1 - fz) + h(i, j + 1) * (1 - fx) * fz + h(i + 1, j + 1) * fx * fz;
  return y * EXAG;
};

export const buildTerrainGeometry = (heights: Int16Array): THREE.BufferGeometry => {
  const N = meta.grid;
  const pos = new Float32Array(N * N * 3);
  const uv = new Float32Array(N * N * 2);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const v = j / (N - 1);
      const k = j * N + i;
      pos[k * 3] = (u - meta.originPx[0]) * meta.sizeMeters;
      pos[k * 3 + 1] = (heights[k] / 10) * EXAG;
      pos[k * 3 + 2] = (v - meta.originPx[1]) * meta.sizeMeters;
      uv[k * 2] = u;
      uv[k * 2 + 1] = 1 - v;
    }
  }
  const idx = new Uint32Array((N - 1) * (N - 1) * 6);
  let t = 0;
  for (let j = 0; j < N - 1; j++) {
    for (let i = 0; i < N - 1; i++) {
      const a = j * N + i;
      const b = a + 1;
      const c = a + N;
      const d = c + 1;
      idx.set([a, c, b, b, c, d], t);
      t += 6;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  return g;
};
