import { Command } from "commander";

const program = new Command();

program.option("--mode <dao>", "se debe poner mongo o file,dependiendo que Dao queremos usar", "MONGO");
program.parse();

export default program.opts();
