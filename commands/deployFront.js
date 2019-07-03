const { spawn } = require("child_process");
const fs = require("fs");

const getEnvironment = env => {
  switch (env) {
    case "production":
      return "prod";
    case "staging":
      return "stg";
    default:
      return "dev";
  }
};

module.exports = async (project, environment) => {
  const env = getEnvironment(environment);
  const projectPath = process.env.PROJECT_PATH || ".";

  let command = `./deploy-${env}.sh`;
  let fileExists = fs.existsSync(command);

  if (!fileExists) {
    throw new Error(`Deploy command not found, ${command}`);
  }

  const child = spawn(command, { cwd: `${projectPath}/${project}` });

  // Make sure stdout will output string
  child.stdout.setEncoding("utf8");

  // Events
  child.stdout.on("data", chunk => {
    // data from standard output is here as buffers
    console.log(chunk);
  });

  child.on("close", code => {
    console.log(`child process exited with code ${code}`);
  });
};
