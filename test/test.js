var assert = require("chai").assert;
const comprehend = require("../comprehension");

describe("Our bot should comprehend", function() {
  it("Should return an object instance", async () => {
    const brain = await comprehend();
    assert.isObject(brain);
  });

  it("Should detect a project and an environment", async () => {
    const brain = await comprehend();
    const classification = await brain.process(
      "Please deploy luxuria into production environment"
    );

    assert.isOk(classification);
    assert.containsAllKeys(classification, "entities");
    assert.lengthOf(classification.entities, 2);
  });
});
