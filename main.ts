import * as esbuild from "esbuild";
import {
  serveDir,
} from "https://deno.land/std@0.207.0/http/file_server.ts";

let result = await esbuild.build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  outdir: "dist",
});
if (result.errors.length > 0) {
  console.error(result.errors);
  Deno.exit(1);
}

Deno.serve((req: Request) => {
  return serveDir(req, {
    fsRoot: "dist",
  });
});
