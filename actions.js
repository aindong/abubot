module.exports = {
  "agent.age": async slack => {
    await web.chat.postMessage({
      text: "Ako ay isang taong gulang pa lamang.",
      channel: event.channel
    });
  }
};
