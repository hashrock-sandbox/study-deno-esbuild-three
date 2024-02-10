/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import * as esbuild from "esbuild";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";
import { serveDir } from "https://deno.land/std@0.207.0/http/file_server.ts";

const result = await esbuild.build({
  plugins: [...denoPlugins({
    configPath: new URL("./deno.json", import.meta.url).pathname,
  })],
  entryPoints: ["src/app.ts"],
  bundle: true,
  outdir: "dist",
});

const BUILD_VERSION = new Date().toISOString();
let timerId: number | undefined = undefined;

Deno.serve((req: Request) => {
  if(new URL(req.url).pathname === "/alive") {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(`data: ${BUILD_VERSION}\nretry: 100\n\n`);
        timerId = setInterval(() => {
          controller.enqueue(`data: ${BUILD_VERSION}\n\n`);
        }, 1000);
      },
      cancel() {
        if (timerId !== undefined) {
          clearInterval(timerId);
        }
      },
    });
    return new Response(body.pipeThrough(new TextEncoderStream()), {
      headers: {
        "content-type": "text/event-stream",
      },
    });
  }

  
  return serveDir(req, {
    fsRoot: "dist",
  });
});
