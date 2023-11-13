import { Command } from "commander";
import { optsLogger } from "../utils/logger.js";

const program = new Command();

program.option("--mode <dao>", "se debe poner mongo o file,dependiendo que Dao queremos usar", "MONGO").option("--env <enviroment>", "se pondrá prod para apuntar a produccion y dev para apuntar a desarrollo", "prod");
program.parse();

optsLogger(program.opts());

export default program.opts();
