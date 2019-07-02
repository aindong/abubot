"use strict";

const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_TOKEN;
// initialize webclient
const web = new WebClient(token);

const availableCommands = ["deploy", "hi", "hey", "how"];

async function processMentionCommand(body) {
  const { event } = body;
  // inspect body
  console.log(body);
  // split text by space
  const command = event.text.split(" ");
  if (!availableCommands.includes(command[1])) {
    await web.chat.postMessage({
      text: `Sorry di kita maintindihan! <@${event.user}>`,
      channel: event.channel
    });
  }

  const cliCommand = command[1].toLowerCase();
  if (cliCommand.match("/deploy/")) {
    console.log("deploy command found");
    await deployProgram(command);
  }
}

async function deployProgram(command) {
  console.log(`the deploy command is: ${command.join(",")}`);
}

module.exports = async body => {
  switch (body.event.type) {
    case "app_mention":
      return await processMentionCommand(body);
    default:
      return false;
  }
};
