import { browserRuntime } from "./browser-runtime.mjs";
const runtime = await browserRuntime();
console.log(`CHROME_PATH=${runtime.executablePath}`);
console.log(`LD_LIBRARY_PATH=${process.env.LD_LIBRARY_PATH || ""}`);
console.log(
  "Browser and local NSS libraries ready. npm run audit:browser and npm run audit:taste use them automatically.",
);
