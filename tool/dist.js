import {readFileSync, writeFileSync} from "node:fs";
import {EOL} from "node:os";

// Packages the project.
const file = "bin/which.js";
writeFileSync(file, `#!/usr/bin/env node${EOL}${readFileSync(file, {encoding: "utf8"})}`);
