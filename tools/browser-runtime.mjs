import chromium from "@sparticuz/chromium";
import { inflate } from "../node_modules/@sparticuz/chromium/build/esm/lambdafs.js";
import path from "node:path";
import os from "node:os";
// The npm-distributed browser includes the NSS libraries missing in minimal containers.
export async function browserRuntime() {
  await inflate(
    path.resolve("node_modules/@sparticuz/chromium/bin/al2023.tar.br"),
  );
  process.env.LD_LIBRARY_PATH = `${path.join(os.tmpdir(), "al2023/lib")}:${process.env.LD_LIBRARY_PATH || ""}`;
  return {
    executablePath: await chromium.executablePath(),
    args: chromium.args,
  };
}
