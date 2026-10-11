import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseKnowledge } from "../site/assets/lib/agent.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
export const chunks = () => parseKnowledge(read("site/data/knowledge.json"));
export const testset = () => read("tests/testset.json");
export const governance = () => read("site/data/governance.json");
