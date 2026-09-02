import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "/OptBound/",
  plugins: [viteSingleFile()],
  build: {
    sourcemap: false,
    assetsInlineLimit: 100000000,
  },
});
