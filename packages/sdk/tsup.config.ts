import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Specify the entry point of your SDK
  format: ["cjs", "esm"], // Output formats: CommonJS and ES Module
  dts: true, // Generate TypeScript declaration files
  sourcemap: true, // Generate source maps for debugging
  clean: true, // Clean the output directory before each build
});
