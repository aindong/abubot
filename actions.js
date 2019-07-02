module.exports = {
  "agent.age": async (slack, body) => {
    const { event } = body;

    await slack.chat.postMessage({
      text: "Ako ay isang taong gulang pa lamang.",
      channel: event.channel
    });
  }
};
