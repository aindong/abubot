"use strict";

const { WebClient } = require("@slack/web-api");
const comprehend = require("./comprehension");
const actions = require("./actions");
const token = process.env.SLACK_TOKEN;
// initialize webclient
const web = new WebClient(token);

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

  const actionController = actions(web, body);
  const actionIntent = classification.intent;

  // Execute action
  await actionController[actionIntent]();
}

module.exports = async body => {
  switch (body.event.type) {
    case "app_mention":
      return await processMentionCommand(body);
    default:
      return false;
  }
};
