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

  let command = `${projectPath}/${project}/deploy-${env}.sh`;
  let fileExists = await fs.exists(command);

  if (!fileExists) {
    throw Error(`Deploy command not found, ${command}`);
  }

  const child = spawn(command);

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
