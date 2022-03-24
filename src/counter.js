/* This code was initialised by Akka Serverless tooling.
 * As long as this file exists it will not be re-generated.
 * You are free to make changes to this file.
 */

import akkaserverless from "@lightbend/akkaserverless-javascript-sdk";
const ValueEntity = akkaserverless.ValueEntity;

const entity = new ValueEntity(
  [
    "counter_api.proto",
    "counter_domain.proto"
  ],
  "com.example.CounterService",
  "counter",
  {
    includeDirs: ["./proto"],
    serializeFallbackToJson: true
  }
);

const CounterState = entity.lookupType("com.example.domain.CounterState");
entity.setInitial(entityId => (CounterState.create({ value: 0 })));

entity.setCommandHandlers({
  Increase(command, state, ctx) {
    if (command.value < 0) {
      ctx.fail(`Increase requires a positive value. It was [${command.value}].`);
    }
    state.value += command.value;
    ctx.updateState(state);
    return {};
  },
  Decrease(command, state, ctx) {
    return ctx.fail("The command handler for `Decrease` is not implemented, yet");
  },
  Reset(command, state, ctx) {
    return ctx.fail("The command handler for `Reset` is not implemented, yet");
  },
  GetCurrentCounter(command, state, ctx) {
    return { value: state.value }
  }
});

export default entity;