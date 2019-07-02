const { NluManager } = require("node-nlp");

async function train() {
  const classifier = new NluManager({ languages: ["en", "tl"] });

  classifier.assignDomain("en", "deploy", "deployment");
  classifier.addDocument("en", "deploy luxuria", "deploy");

  classifier.assignDomain("en", "agent.acquaintance", "personality");
  classifier.addDocument("en", "say about you", "agent.acquaintance");
  classifier.addDocument("en", "why are you here", "agent.acquaintance");
  classifier.addDocument(
    "en",
    "what is your personality",
    "agent.acquaintance"
  );
  classifier.addDocument("en", "describe yourself", "agent.acquaintance");
  classifier.addDocument("en", "tell me about yourself", "agent.acquaintance");
  classifier.addDocument("en", "tell me about you", "agent.acquaintance");
  classifier.addDocument("en", "what are you", "agent.acquaintance");
  classifier.addDocument("en", "who are you", "agent.acquaintance");
  classifier.addDocument("en", "talk about yourself", "agent.acquaintance");

  classifier.assignDomain("en", "agent.age", "personality");
  classifier.addDocument("en", "your age", "agent.age");
  classifier.addDocument("en", "how old is your platform", "agent.age");
  classifier.addDocument("en", "how old are you", "agent.age");
  classifier.addDocument("en", "what's your age", "agent.age");
  classifier.addDocument("en", "I'd like to know your age", "agent.age");
  classifier.addDocument("en", "tell me your age", "agent.age");

  await classifier.train();

  return classifier;
}

async function classify(classifier, message) {
  const classifications = classifier.getClassifications(message);
  return classifications;
}

module.exports = {
  train,
  classify
};
