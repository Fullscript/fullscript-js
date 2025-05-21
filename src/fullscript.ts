/* eslint-disable @typescript-eslint/naming-convention */
type FullscriptDomain =
  | "https://ca.fullscript.com"
  | "https://us.fullscript.com"
  | "https://ca-snd.fullscript.io"
  | "https://us-snd.fullscript.io"
  | "http://localhost:3000";

const FULLSCRIPT_DOMAINS: { [key: string]: FullscriptDomain } = {
  ca: "https://ca.fullscript.com",
  us: "https://us.fullscript.com",
  "ca-snd": "https://ca-snd.fullscript.io",
  "us-snd": "https://us-snd.fullscript.io",
  dev: "http://localhost:3000",
};

type FullscriptEnv = "us" | "ca" | "us-snd" | "ca-snd" | "dev";
type FullscriptOptions = { publicKey: string; env: FullscriptEnv; domain?: string };

export { FULLSCRIPT_DOMAINS };
export type { FullscriptEnv, FullscriptOptions, FullscriptDomain };
