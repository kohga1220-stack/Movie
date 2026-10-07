import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { World, type Sky } from "./World";
import { Army, Flag3, Path3, Ring3 } from "./world3d";
import { LM } from "./terrain";
import { cameraAt, sceneAt, CANVAS_H, CANVAS_W } from "./shots";
import { theme } from "./config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 軍勢は「イメージ」（実際の布陣・兵数ではない）。位置は、盆地の東側と西側に置いた概略。
export const EAST_POS: [number, number] = [1900, -80];
export const WEST_POS: [number, number] = [-850, 60];
const M = LM.matsuoyama;

const skyAt = (frame: number): Sky => {
  const { scene, local } = sceneAt(frame);
  const m = scene.marks;
  const clear: Sky = { fogColor: "#b9c6cf", fogNear: 3500, fogFar: 26000, sunColor: "#ffe2b8", sunIntensity: 2.5, sunPos: [6000, 3500, -2000], ambient: 0.95 };
  switch (scene.id) {
    case "intro":
      return { ...clear, fogColor: "#c6d0d8" };
    case "morning": {
      const a = interpolate(local, [m.fog - 6, m.fog + 30, m.h10, m.h10 + 70], [0, 1, 1, 0], { ...clamp }); // 霧の濃さ
      return {
        fogColor: "#cfd6dc",
        fogNear: 250 + (3500 - 250) * (1 - a),
        fogFar: 4200 + (26000 - 4200) * (1 - a),
        sunColor: "#ffd9a8",
        sunIntensity: 1.6 + 0.9 * (1 - a),
        sunPos: [7000, 1500 + 2000 * (1 - a), -1500],
        ambient: 0.8 + 0.15 * (1 - a),
      };
    }
    case "shots":
      return { fogColor: "#1d2533", fogNear: 1800, fogFar: 16000, sunColor: "#9fb2d6", sunIntensity: 1.2, sunPos: [-4000, 2500, 3000], ambient: 0.7 };
    case "end":
      return { ...clear, fogColor: "#e6d9bd", sunColor: "#ffe9c2", sunIntensity: 2.9 };
    default:
      return clear;
  }
};

const useSp = (at: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { mass: 1, stiffness: 180, damping: 22 } });
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const prog = (f: number, start: number, dur: number) => ease(Math.min(1, Math.max(0, (f - start) / dur)));

const Content: React.FC<{ heights: Int16Array }> = ({ heights }) => {
  const f = useCurrentFrame();
  const { scene, local } = sceneAt(f);
  const m = scene.marks;
  const sp = (at: number) => Math.min(1, Math.max(0, (local - at) / 14)); // 出現（0→1）
  const east = theme.east;
  const west = theme.west;
  const base = (
    <>
      <Army heights={heights} from={EAST_POS} to={[EAST_POS[0] - 300, EAST_POS[1]]} progress={0} color={east} seed={3} cols={14} rows={7} />
      <Army heights={heights} from={WEST_POS} to={[WEST_POS[0] + 300, WEST_POS[1]]} progress={0} color={west} seed={5} cols={14} rows={7} />
    </>
  );
  switch (scene.id) {
    case "intro": {
      const pe = sp(m.east);
      const pw = sp(m.west);
      return (
        <>
          <group visible={pe > 0}>
            <Army heights={heights} from={EAST_POS} to={[EAST_POS[0] - 300, EAST_POS[1]]} progress={0} color={east} seed={3} cols={14} rows={7} opacity={pe} />
            <Flag3 heights={heights} x={EAST_POS[0] - 60} z={EAST_POS[1]} color={east} scale={1.6} p={pe} />
          </group>
          <group visible={pw > 0}>
            <Army heights={heights} from={WEST_POS} to={[WEST_POS[0] + 300, WEST_POS[1]]} progress={0} color={west} seed={5} cols={14} rows={7} opacity={pw} />
            <Flag3 heights={heights} x={WEST_POS[0] + 60} z={WEST_POS[1]} color={west} scale={1.6} p={pw} />
          </group>
        </>
      );
    }
    case "morning":
    case "shots":
      return base;
    case "vanguard": {
      const pF = prog(local, m.fukushima + 4, 80);
      const pI = prog(local, m.iiGo - 4, 80);
      const pathF: [number, number][] = [[EAST_POS[0] + 300, -160], [1200, -160], [350, -120]];
      const pathI: [number, number][] = [[EAST_POS[0] + 300, 150], [1100, 130], [200, 30]];
      return (
        <>
          <Army heights={heights} from={WEST_POS} to={[WEST_POS[0] + 300, WEST_POS[1]]} progress={0} color={west} seed={5} cols={14} rows={7} />
          <Army heights={heights} from={[EAST_POS[0] + 300, -160]} to={[900, -150]} progress={pF * 0.9} color={east} seed={7} cols={9} rows={6} />
          <Army heights={heights} from={[EAST_POS[0] + 300, 150]} to={[700, 90]} progress={pI * 0.9} color="#7fc4ee" seed={9} cols={7} rows={5} />
          <Flag3 heights={heights} x={EAST_POS[0] + 300} z={-160} color={east} scale={1.0} p={sp(m.fukushima)} />
          <Flag3 heights={heights} x={EAST_POS[0] + 300} z={150} color="#7fc4ee" scale={1.0} p={sp(m.ii)} />
          <Path3 heights={heights} pts={pathF} progress={pF} color={east} width={15} />
          <Path3 heights={heights} pts={pathI} progress={pI} color="#7fc4ee" dashed width={15} opacity={interpolate(local, [m.iiGo + 100, m.iiGo + 130], [1, 0.7], { ...clamp })} />
        </>
      );
    }
    case "betrayal": {
      const flip = local >= m.betray;
      const col = flip ? east : west;
      const pB = prog(local, m.betray, 70);
      const path: [number, number][] = [[M[0] + 40, M[1] - 80], [-1000, 1300], [-760, 560]];
      return (
        <>
          <Army heights={heights} from={[M[0] + 40, M[1] - 80]} to={[-780, 600]} progress={pB * 0.85} color={col} seed={13} cols={8} rows={6} spacing={30} />
          <Flag3 heights={heights} x={M[0]} z={M[1]} color={col} scale={1.8} p={sp(m.kobayakawa)} />
          <Path3 heights={heights} pts={path} progress={pB} color={east} />
          <Ring3 heights={heights} x={M[0]} z={M[1]} t={Math.min(1, Math.max(0, (local - m.betray) / 40))} color={theme.accent} maxR={600} />
        </>
      );
    }
    case "end":
      return (
        <>
          <Army heights={heights} from={WEST_POS} to={[WEST_POS[0] + 300, WEST_POS[1]]} progress={0} color={west} seed={5} cols={14} rows={7} opacity={0.5} />
          <Army heights={heights} from={[EAST_POS[0] - 800, -40]} to={[EAST_POS[0] - 900, -40]} progress={0} color={east} seed={3} cols={14} rows={9} />
        </>
      );
    default:
      return null;
  }
};

export const WorldLayer: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAt(f);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: CANVAS_W, height: CANVAS_H }}>
      <World width={CANVAS_W} height={CANVAS_H} cam={cam} sky={skyAt(f)}>
        {(d) => <Content heights={d.heights} />}
      </World>
    </div>
  );
};
