The Model {+Metadata} {+Operations}:

stage {time, state, person, ttl}
  ^- artefact {version, buildUrl, artefactPath} {CRUD+ }
    ^- pipeline {name, stages} {CRUD+ lastSuccessfulForStage, cleanupArtefacts}
      ^- project {name} {CRUD}
