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
          "Ako si `Abubot`. Ako ay isang robot ::robot_face: na nagmula sa future, kaya ko ideploy ang iyong project sa ulap :cloud:",
        channel: event.channel
      });
    },

    // Deployment action
    deploy: async (body, classification) => {
      const { event } = body;

      // Initial
      await slack.chat.postMessage({
        text: `:bow: Sandali lamang po *master* <@${
          event.user
        }>, ang iyong proyekto ay aking hinahanap`,
        channel: event.channel
      });

      // Detect for errors
      if (classification.entities.length < 2) {
        return await sendErrorMessage(
          ":x: Pasensya kana master, di ko mahanap ang iyong proyekto"
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
          ":x: Pasensya kana master, di ko mahanap ang iyong proyekto"
        );
      }

      if (project.option === "robinsons") {
        await slack.chat.postMessage({
          text: `:x: Pasensya kana, ngungit ako ay walang kakayahang ideploy ang project na: ${
            project.utteranceText
          } sa ${environment.utteranceText}.`,
          channel: event.channel
        });

        return;
      }

      // Say that we found the project
      await slack.chat.postMessage({
        text: `:balloon: Idedeploy ko na ang ${project.utteranceText} sa ${
          environment.utteranceText
        } :cloud: *Bigyan mo ako ng lima hanggang sampung minuto* :alarm_clock:.`,
        channel: event.channel
      });

      try {
        await deployFront(
          slack,
          event,
          project.utteranceText,
          environment.utteranceText
        );
      } catch (err) {
        let error = err.message;
        if (err.message.match(/Deploy command not found/)) {
          error = `:x: Paumanhin, ngunit hindi ko mahanap ang deployment command para sa project na \n${
            project.utteranceText
          } at environment ${environment.utteranceText}`;
        }

        await slack.chat.postMessage({
          text: error,
          channel: event.channel
        });
      }
    }
  };
};
