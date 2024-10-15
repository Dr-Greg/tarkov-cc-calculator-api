import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    dev: {
      cmd: "deno run src/app.ts",
      allow: ["run", "net", "read", "write", "env"],
      desc: "run my app.ts file",
    },
  },
};

export default config;
