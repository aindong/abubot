const { spawn } = require("child_process");

const getEnvironment = env => {
  switch (environment) {
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
