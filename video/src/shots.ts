// 各場面のカメラの動き（世界座標：メートル。原点は関ヶ原、x=東、z=南、y=高さ）。
// t は場面の長さに対する割合（0〜1）。キーの間は、なめらかに補間する。
import * as THREE from "three";
import { LM } from "./terrain";
import { SCENES, WIDTH } from "./config";
import type { Cam } from "./World";

type V3 = [number, number, number];
type Key = { t: number; pos: V3; target: V3; fov: number };

export const CANVAS_W = WIDTH;
export const CANVAS_H = 1560;

const M = LM.matsuoyama;
export const SHOTS: Record<string, Key[]> = {
  intro: [
    { t: 0, pos: [300, 11000, 1500], target: [0, 200, 300], fov: 40 },
    { t: 0.55, pos: [300, 11000, 1500], target: [0, 200, 300], fov: 40 },
    { t: 1, pos: [550, 2200, 3600], target: [550, 200, 0], fov: 66 },
  ],
  morning: [
    { t: 0, pos: [1900, 620, -350], target: [-900, 340, 100], fov: 40 },
    { t: 1, pos: [1100, 540, -250], target: [-1300, 340, 100], fov: 40 },
  ],
  vanguard: [
    { t: 0, pos: [4500, 1250, 1000], target: [800, 230, -20], fov: 40 },
    { t: 1, pos: [3500, 1000, 800], target: [300, 230, -20], fov: 40 },
  ],
  betrayal: [
    { t: 0, pos: [-100, 1150, -2000], target: [M[0] * 0.9, 330, 1650], fov: 40 },
    { t: 1, pos: [-500, 900, -900], target: [M[0], 440, M[1]], fov: 38 },
  ],
  shots: [
    { t: 0, pos: [900, 700, -900], target: [0, 250, 0], fov: 40 },
    { t: 1, pos: [1300, 620, -650], target: [0, 250, 0], fov: 40 },
  ],
  end: [
    { t: 0, pos: [2600, 1500, -2600], target: [0, 250, 300], fov: 40 },
    { t: 1, pos: [3300, 2500, -3300], target: [0, 250, 300], fov: 40 },
  ],
};

const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

export const sceneAt = (frame: number) => {
  let idx = 0;
  SCENES.forEach((s, i) => {
    if (frame >= s.from) idx = i;
  });
  return { scene: SCENES[idx], idx, local: frame - SCENES[idx].from };
};

export const cameraAt = (frame: number): Cam => {
  const { scene, local } = sceneAt(frame);
  const keys = SHOTS[scene.id];
  const t = Math.min(1, Math.max(0, local / scene.frames));
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const k = b.t === a.t ? 1 : smooth((t - a.t) / (b.t - a.t));
  return { pos: lerp3(a.pos, b.pos, k), target: lerp3(a.target, b.target, k), fov: a.fov + (b.fov - a.fov) * k };
};

const projCam = new THREE.PerspectiveCamera(40, CANVAS_W / CANVAS_H, 20, 90000);
const tmp = new THREE.Vector3();
/** 世界座標を、キャンバス上の画面座標（ピクセル）に変換する。ラベルの位置決めに使う。画面外・背後は null。 */
export const projectAt = (frame: number, p: V3): { x: number; y: number } | null => {
  const c = cameraAt(frame);
  projCam.fov = c.fov;
  projCam.position.set(...c.pos);
  projCam.lookAt(...c.target);
  projCam.updateProjectionMatrix();
  projCam.updateMatrixWorld();
  tmp.set(...p).project(projCam);
  if (tmp.z > 1) return null;
  return { x: ((tmp.x + 1) / 2) * CANVAS_W, y: ((1 - tmp.y) / 2) * CANVAS_H };
};
