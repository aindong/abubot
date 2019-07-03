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

module.exports = async (slack, event, project, environment) => {
  const env = getEnvironment(environment);
  const projectPath = process.env.PROJECT_PATH || ".";

  let command = `./deploy-${env}.sh`;
  let filePath = `${projectPath}/${project}/deploy-${env}.sh`;
  let fileExists = fs.existsSync(filePath);

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
    slack.chat.postMessage({
      text: chunk,
      channel: event.channel
    });
  });

  child.on("close", code => {
    if (code === 0) {
      slack.chat.postMessage({
        text: `Nadeploy ko na ang ${project} sa ${environment}. Maaari mo na itong subukan. Maraming salamat!`,
        channel: event.channel
      });
    } else {
      slack.chat.postMessage({
        text: `Paumanhin, ngunit ang iyong deploy command ay hindi nagpatuloy, ito ay biglaang nagsarado: ${code}`,
        channel: event.channel
      });
    }
  });
};
