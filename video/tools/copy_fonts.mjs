// npm の @expo-google-fonts（Noto Serif JP / Noto Sans JP、SIL OFL 1.1）から、使う太さの TTF を public/fonts/ にコピーする。
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/fonts", { recursive: true });
const files = [
  ["noto-serif-jp/700Bold/NotoSerifJP_700Bold.ttf", "NotoSerifJP-Bold.ttf"],
  ["noto-serif-jp/900Black/NotoSerifJP_900Black.ttf", "NotoSerifJP-Black.ttf"],
  ["noto-sans-jp/500Medium/NotoSansJP_500Medium.ttf", "NotoSansJP-Medium.ttf"],
  ["noto-sans-jp/700Bold/NotoSansJP_700Bold.ttf", "NotoSansJP-Bold.ttf"],
];
for (const [src, dst] of files) copyFileSync(`node_modules/@expo-google-fonts/${src}`, `public/fonts/${dst}`);
console.log("fonts copied:", files.length);
