const { NlpManager } = require("node-nlp");
const modelPath = "model.nlp";

async function train() {
  const manager = new NlpManager({ languages: ["en", "tl"] });
  manager.addNamedEntityText(
    "project",
    "robinsons",
    ["en"],
    ["luxuria", "communities", "residences", "omnibus"]
  );

  manager.addNamedEntityText(
    "environment",
    "environment",
    ["en"],
    ["staging", "develop", "production"]
  );

  manager.assignDomain("en", "deploy", "deployment");
  manager.addDocument("en", "deploy %project% to %environment%", "deploy");
  manager.addDocument(
    "en",
    "please deploy the %project% to %environment%",
    "deploy"
  );
  manager.addDocument(
    "en",
    "can you deploy the project %project% to %environment%",
    "deploy"
  );

  manager.assignDomain("en", "agent.acquaintance", "personality");
  manager.addDocument("en", "say about you", "agent.acquaintance");
  manager.addDocument("en", "why are you here", "agent.acquaintance");
  manager.addDocument("en", "what is your personality", "agent.acquaintance");
  manager.addDocument("en", "describe yourself", "agent.acquaintance");
  manager.addDocument("en", "tell me about yourself", "agent.acquaintance");
  manager.addDocument("en", "tell me about you", "agent.acquaintance");
  manager.addDocument("en", "what are you", "agent.acquaintance");
  manager.addDocument("en", "who are you", "agent.acquaintance");
  manager.addDocument("en", "talk about yourself", "agent.acquaintance");

  manager.assignDomain("en", "agent.age", "personality");
  manager.addDocument("en", "your age", "agent.age");
  manager.addDocument("en", "how old is your platform", "agent.age");
  manager.addDocument("en", "how old are you", "agent.age");
  manager.addDocument("en", "what's your age", "agent.age");
  manager.addDocument("en", "I'd like to know your age", "agent.age");
  manager.addDocument("en", "tell me your age", "agent.age");

  manager.assignDomain("tl", "agent.age", "personality");
  manager.addDocument("tl", "ilang taon kana?", "agent.age");
  manager.addDocument("tl", "anong edad mo?", "agent.age");
  manager.addDocument("tl", "ilan kana?", "agent.age");

  manager.assignDomain("tl", "agent.acquaintance", "personality");
  manager.addDocument("tl", "sino ka?", "agent.acquaintance");
  manager.addDocument("tl", "anong purpose mo?", "agent.acquaintance");
  manager.addDocument("tl", "ano pangalan mo?", "agent.acquaintance");
  manager.addDocument(
    "tl",
    "magsabi ka tungkol sa sarili mo",
    "agent.acquaintance"
  );

  await manager.train();
  manager.save(modelPath);
  return manager;
}

train();
