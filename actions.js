module.exports = slack => {
  return {
    "agent.age": async body => {
      const { event } = body;

      await slack.chat.postMessage({
        text: "Ako ay isang taong gulang pa lamang.",
        channel: event.channel
      });
    }
  };
};
