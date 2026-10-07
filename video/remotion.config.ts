import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 3D（three.js）の描画に WebGL を使う。ヘッドレス環境では ANGLE（ソフトウェア描画）を指定する。
Config.setChromiumOpenGlRenderer("angle");
