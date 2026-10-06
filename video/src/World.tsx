import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildTerrainGeometry, useTerrainData, type TerrainData } from "./terrain";

export type Cam = { pos: [number, number, number]; target: [number, number, number]; fov: number };

const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(...cam.pos);
    camera.fov = cam.fov;
    camera.near = 20;
    camera.far = 90000;
    camera.lookAt(...cam.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  });
  return null;
};

const Terrain: React.FC<{ data: TerrainData }> = ({ data }) => {
  const geo = useMemo(() => buildTerrainGeometry(data.heights), [data]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial map={data.texture} roughness={1} metalness={0} />
    </mesh>
  );
};

export type Sky = { fogColor: string; fogNear: number; fogFar: number; sunColor: string; sunIntensity: number; sunPos: [number, number, number]; ambient: number };

export const World: React.FC<{ width: number; height: number; cam: Cam; sky: Sky; children?: (d: TerrainData) => React.ReactNode }> = ({
  width,
  height,
  cam,
  sky,
  children,
}) => {
  const data = useTerrainData();
  if (!data) return null;
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: cam.fov, position: cam.pos, near: 20, far: 90000 }} gl={{ antialias: true }}>
      <color attach="background" args={[sky.fogColor]} />
      <fog attach="fog" args={[sky.fogColor, sky.fogNear, sky.fogFar]} />
      <ambientLight intensity={sky.ambient} />
      <directionalLight position={sky.sunPos} color={sky.sunColor} intensity={sky.sunIntensity} />
      <Rig cam={cam} />
      <Terrain data={data} />
      {children?.(data)}
    </ThreeCanvas>
  );
};
