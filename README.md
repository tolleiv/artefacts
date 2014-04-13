The Model {+Metadata} {+Operations}:
====================================

http://yuml.me/eca76789

state {time, stageStep, person}
  ^- artefact {version, buildUrl, artefactPath} {CRUD+ }
    ^- stateStep { name, ttl, next }
    ^- pipeline {name, firstStep} {CRUD+ lastSuccessfulForStage, cleanupArtefacts}
      ^- project {name} {CRUD}
