import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

/** シーン内で、各ナレーション文・語句が読まれるフレーム。映像はこれに合わせて動く。 */
export type Cues = { chunks: number[]; marks: Record<string, number>; from: number };
export const CueContext = createContext<Cues>({ chunks: [], marks: {}, from: 0 });
export const useCue = (i: number) => useContext(CueContext).chunks[i] ?? 0;
/** 語句が読まれるフレーム。映像が少し先行して見えるよう、既定で 4 フレーム手前にする。 */
export const useMark = (name: string, lead = 4) => {
  const m = useContext(CueContext).marks[name];
  if (m === undefined) throw new Error(`目印がない: ${name}`);
  return m - lead;
};
/** 動画全体でのフレーム（シーン内のフレーム＋シーンの開始）。 */
export const useGlobalFrame = () => useContext(CueContext).from + useCurrentFrame();
