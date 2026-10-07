import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// フォントは tools/copy_fonts.mjs が public/fonts/ にコピーする（Noto Serif JP / Noto Sans JP、SIL OFL 1.1）。
export const FONT_SERIF = "'Noto Serif JP','IPAexMincho',serif";
export const FONT_SANS = "'Noto Sans JP','IPAexGothic','IPAGothic',sans-serif";

export const loadFonts = () =>
  Promise.all([
    loadFont({ family: "Noto Serif JP", url: staticFile("fonts/NotoSerifJP-Bold.ttf"), weight: "700" }),
    loadFont({ family: "Noto Serif JP", url: staticFile("fonts/NotoSerifJP-Black.ttf"), weight: "900" }),
    loadFont({ family: "Noto Sans JP", url: staticFile("fonts/NotoSansJP-Medium.ttf"), weight: "500" }),
    loadFont({ family: "Noto Sans JP", url: staticFile("fonts/NotoSansJP-Bold.ttf"), weight: "700" }),
  ]);
