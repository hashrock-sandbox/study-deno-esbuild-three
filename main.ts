/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import * as esbuild from "esbuild";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";
import { serveDir } from "https://deno.land/std@0.207.0/http/file_server.ts";

await esbuild.build({
  plugins: [...denoPlugins({
    configPath: new URL("./deno.json", import.meta.url).pathname
  })],
  entryPoints: ["src/app.ts"],
  bundle: true,
  outdir: "dist",
});

Deno.serve((req: Request) => {
  return serveDir(req, {
    fsRoot: "dist",
  });
});
