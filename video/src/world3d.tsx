import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { EXAG, heightAt } from "./terrain";

/** 旗（幟）。風にゆれる布つき。 */
export const Flag3: React.FC<{ heights: Int16Array; x: number; z: number; color: string; scale?: number; p?: number }> = ({ heights, x, z, color, scale = 1, p = 1 }) => {
  const f = useCurrentFrame();
  const y = heightAt(heights, x, z);
  const H = 150 * scale;
  return (
    <group position={[x, y, z]} scale={[p, p, p]}>
      <mesh position={[0, H / 2, 0]}>
        <cylinderGeometry args={[2.2 * scale, 2.2 * scale, H, 8]} />
        <meshStandardMaterial color="#e9dfc4" roughness={0.8} />
      </mesh>
      <mesh position={[26 * scale, H - 28 * scale, 0]} rotation={[0, Math.sin(f / 6 + x) * 0.25, 0]}>
        <boxGeometry args={[52 * scale, 52 * scale, 1.5 * scale]} />
        <meshStandardMaterial color={color} roughness={0.7} emissive={color} emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
};

/** 軍勢のイメージ。小さな人影の隊列が、始点から終点へ進む（実際の布陣・兵数ではない）。 */
export const Army: React.FC<{
  heights: Int16Array;
  from: [number, number];
  to: [number, number];
  progress: number;
  color: string;
  cols?: number;
  rows?: number;
  spacing?: number;
  seed?: number;
  opacity?: number;
}> = ({ heights, from, to, progress, color, cols = 14, rows = 8, spacing = 34, seed = 1, opacity = 1 }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = cols * rows;
  const jitter = useMemo(() => {
    let s = seed * 9301;
    const r = () => {
      s = (s * 49297 + 233280) % 233280;
      return s / 233280 - 0.5;
    };
    return Array.from({ length: count }, () => [r() * spacing * 0.5, r() * spacing * 0.5, 0.8 + (r() + 0.5) * 0.5] as const);
  }, [count, seed, spacing]);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const dx = to[0] - from[0];
    const dz = to[1] - from[1];
    const len = Math.hypot(dx, dz) || 1;
    const ux = dx / len;
    const uz = dz / len;
    const cx = from[0] + dx * progress;
    const cz = from[1] + dz * progress;
    const o = new THREE.Object3D();
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lx = (r - rows / 2) * spacing * 1.1; // 進行方向
        const lz = (c - cols / 2) * spacing; // 横
        const [jx, jz, js] = jitter[i];
        const x = cx + ux * lx - uz * lz + jx;
        const z = cz + uz * lx + ux * lz + jz;
        o.position.set(x, heightAt(heights, x, z) + 18 * js, z);
        o.scale.set(js, js, js);
        o.updateMatrix();
        m.setMatrixAt(i++, o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <coneGeometry args={[9, 40, 6]} />
      <meshStandardMaterial color={color} roughness={0.6} emissive={color} emissiveIntensity={0.3} transparent opacity={opacity} />
    </instancedMesh>
  );
};

/** 地形に沿って伸びる、進軍の矢印。dashed は「逸話・不確か」。 */
export const Path3: React.FC<{
  heights: Int16Array;
  pts: [number, number][];
  progress: number;
  color: string;
  dashed?: boolean;
  width?: number;
  lift?: number;
  opacity?: number;
}> = ({ heights, pts, progress, color, dashed = false, width = 22, lift = 26, opacity = 1 }) => {
  const SAMPLES = 80;
  const { line, head } = useMemo(() => {
    const g = new LineGeometry();
    g.setPositions([0, 0, 0, 1, 1, 1]);
    const mat = new LineMaterial({ color: new THREE.Color(color), linewidth: width, worldUnits: true, dashed, dashSize: width * 2.2, gapSize: width * 1.4, transparent: true });
    mat.resolution.set(1080, 1560);
    const l = new Line2(g, mat);
    const h = new THREE.Mesh(new THREE.ConeGeometry(width * 1.7, width * 4, 14), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, roughness: 0.5, transparent: true }));
    return { line: l, head: h };
  }, [color, dashed, width]);
  useLayoutEffect(() => {
    const full: THREE.Vector3[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const t = (i / SAMPLES) * (pts.length - 1);
      const k = Math.min(pts.length - 2, Math.floor(t));
      const a = pts[k];
      const b = pts[k + 1];
      const x = a[0] + (b[0] - a[0]) * (t - k);
      const z = a[1] + (b[1] - a[1]) * (t - k);
      full.push(new THREE.Vector3(x, heightAt(heights, x, z) + lift, z));
    }
    const n = Math.max(2, Math.round(progress * SAMPLES) + 1);
    const part = full.slice(0, Math.min(n, full.length));
    const arr: number[] = [];
    part.forEach((v) => arr.push(v.x, v.y, v.z));
    line.geometry.setPositions(arr);
    line.computeLineDistances();
    (line.material as LineMaterial).opacity = opacity;
    (head.material as THREE.MeshStandardMaterial).opacity = opacity;
    const e = part[part.length - 1];
    const p = part[Math.max(0, part.length - 4)];
    head.position.copy(e);
    const dir = e.clone().sub(p).normalize();
    head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    head.visible = progress > 0.02;
    line.visible = progress > 0.02;
  });
  return (
    <>
      <primitive object={line} />
      <primitive object={head} />
    </>
  );
};

/** 地面に広がる輪（強調用）。 */
export const Ring3: React.FC<{ heights: Int16Array; x: number; z: number; t: number; color: string; maxR?: number }> = ({ heights, x, z, t, color, maxR = 700 }) => {
  if (t <= 0 || t >= 1) return null;
  const y = heightAt(heights, x, z) + 20;
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[maxR * t, maxR * t + 20, 64]} />
      <meshBasicMaterial color={color} transparent opacity={1 - t} side={THREE.DoubleSide} />
    </mesh>
  );
};

export { EXAG };
