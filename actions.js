const deployFront = require("./commands/deployFront");

module.exports = slack => {
  const sendErrorMessage = async message => {
    await slack.chat.postMessage({
      text: message,
      channel: event.channel
    });
  };

  return {
    // Agent specific information actions
    "agent.age": async body => {
      const { event } = body;

      await slack.chat.postMessage({
        text: "Ako ay isang taong gulang pa lamang.",
        channel: event.channel
      });
    },
    "agent.acquaintance": async body => {
      const { event } = body;

      await slack.chat.postMessage({
        text:
          "Ako si `Abubot`. Ako ay isang robot na nagmula sa future, kaya ko ideploy ang iyong project sa ulap",
        channel: event.channel
      });
    },

    // Deployment action
    deploy: async (body, classification) => {
      const { event } = body;

      // Initial
      await slack.chat.postMessage({
        text: `Sandali lamang po *master* <@${
          event.user
        }>, ang iyong proyekto ay aking hinahanap`,
        channel: event.channel
      });

      // Detect for errors
      if (classification.entities.length < 2) {
        return await sendErrorMessage(
          "Pasensya kana master, di ko mahanap ang iyong proyekto"
        );
      }

      const environment = classification.entities.find(
        item => item.entity === "environment"
      );
      const project = classification.entities.find(
        item => item.entity === "project"
      );

      if (!environment || !project) {
        return await sendErrorMessage(
          "Pasensya kana master, di ko mahanap ang iyong proyekto"
        );
      }

      // Say that we found the project
      await slack.chat.postMessage({
        text: `Paumanhin sa paghihintay. \n Idedeploy ko na ang ${
          project.utteranceText
        } sa ${environment.utteranceText}.`,
        channel: event.channel
      });

      try {
        await deployFront(project.utteranceText, environment.utteranceText);
      } catch (err) {
        if (err.message.match(/Deploy command not found/)) {
          await slack.chat.postMessage({
            text: `Paumanhin, ngunit hindi ko mahanap ang deployment command para sa project na \n${
              project.utteranceText
            } at environment ${environment.utteranceText}`,
            channel: event.channel
          });
        }
      }
    }
  };
};
