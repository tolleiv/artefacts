exports.Project = Project = require("./project");
exports.Pipeline = Pipeline = require("./pipeline");
exports.Artefact = Artefact = require("./artefact");
exports.StateMachine = StateMachine = require("./statemachine");
exports.State = State = require("./state");


Pipeline.hasOne(Project);
Pipeline.hasOne(StateMachine);

Artefact
    .hasOne(Pipeline, { createHasMany: true })
    .hasOne(State, { name: 'currentState', foreignKey: 'current_state_id', createHasMany: false });

StateMachine
    .hasOne(State, { name: 'initialState', foreignKey: 'initial_state_id', createHasMany: false })
    .hasMany(State)




