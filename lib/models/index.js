exports.Project = Project = require("./project");
exports.Pipeline = Pipeline = require("./pipeline");
exports.Artefact = Artefact = require("./artefact");
exports.ArtefactState = ArtefactState = require("./artefactstate");
exports.State = State = require("./state");

Pipeline.hasOne(Project);

Artefact
    .hasOne(Pipeline, { createHasMany: true });

ArtefactState
    .hasOne(Artefact, { createHasMany: true })
    .hasOne(State, { createHasMany: false });

