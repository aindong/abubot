module.exports = async (slack, body) => {
  return {
    "agent.age": async () => {
      const { event } = body;

      await slack.chat.postMessage({
        text: "Ako ay isang taong gulang pa lamang.",
        channel: event.channel
      });
    }
  };
};
