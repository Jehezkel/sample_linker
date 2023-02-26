import type { Config } from "@jest/types";
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testRegex: "tests/.*\\.test\\.ts$",
};

export default config;
