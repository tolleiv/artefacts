Usage
=====

Until now this has just a REST API - the UI will follow soon.

Command line
------------

` curl -i -X PUT http://localhost:3000/c/:project/:pipeline/:artefact/:state/:code `

Development
===========

API overview
------------

Method | Path | Usage
-------|------|------
GET | /projects | List projects
POST | /project | Create project
GET, PUT, DEL | /project/:id | Read, Update, Delete project
GET | /project/:id/pipelines | List pipelines for project
POST | /pipeline | Create pipeline
GET, PUT, DEL | /pipeline/:id | Read, Update, Delete pipeline
GET | /pipeline/:id/artefacts | List artefacts for pipeline
POST | /artefact | Create artefact
GET, PUT, DEL | /artefact/:id | Read, Update, Delete artefact
PUT | /artefact/:id/:state/:code | Create/Update artefact state with specified code
PUT | /c/:project/:pipeline/:artefact/:state/:code | Create/Update artefact state with the specified code for the existing artefact.
POST | /c/:project/:pipeline/:artefact/:state/:code | Create artefact and artefact state (initial registration)

The Model {+Metadata} {+Operations}
-----------------------------------

![Model UML](http://yuml.me/9c218eba)

* project {title} {CRUD}
* pipeline {title} {CRUD+ lastSuccessfulForState, cleanupArtefact}
* artefact {version, buildUrl, artefactPath, currentState} {CRUD+ }
* artefactState {code, artefact,state}
* state {title, ttl} {CRUD}

Build status
------------

[![Build Status](https://travis-ci.org/tolleiv/artefacts.png?branch=master)](https://travis-ci.org/tolleiv/artefacts)


License
-------

This is free and unencumbered software released into the public domain. See the UNLICENSE file or http://unlicense.org/ for more details.