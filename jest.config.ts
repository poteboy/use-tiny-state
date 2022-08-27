import { Config } from "@jest/types";
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testMatch: ["<rootDir>/**/__tests__/*.test.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  errorOnDeprecated: true,
};
export default config;
