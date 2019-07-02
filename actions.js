module.exports = slack => {
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
    deploy: async body => {
      const { event } = body;

      await slack.chat.postMessage({
        text: `Sandali lamang po *master* <@${
          event.user
        }>, ang iyong proyekto ay aking hinahanap`,
        channel: event.channel
      });
    }
  };
};
