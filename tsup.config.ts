import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["server/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  external: ["vite"],
  outDir: "server-build",
  clean: true,
  removeNodeProtocol: false,
});
