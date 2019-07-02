"use strict";

const { WebClient } = require("@slack/web-api");
const comprehend = require("./comprehension");
const ActionsController = require("./actions");
const token = process.env.SLACK_TOKEN;
// initialize webclient
const web = new WebClient(token);
const actionController = ActionsController(web);

const currentProjects = ["luxuria", "communities", "residences", "omnibus"];

async function processMentionCommand(body) {
  const { event } = body;
  // inspect body
  console.log(body);
  // Train the nlp
  const classifier = await comprehend.train();
  const classification = await comprehend.classify(classifier, event.text);

  if (classification.intent === "None") {
    await web.chat.postMessage({
      text: `Pasensya kana <@${
        event.user
      }>, wala akong maintindihan sa sinabi mo.`,
      channel: event.channel
    });

    return false;
  }

  // Execute action
  const actionIntent = classification.intent;
  console.log(`Invoking ${actionIntent} intent`);
  console.log(actionController);
  await actionController[actionIntent](body);
}

module.exports = async body => {
  switch (body.event.type) {
    case "app_mention":
      return await processMentionCommand(body);
    default:
      return false;
  }
};
