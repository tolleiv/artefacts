Usage
=====


Command line
------------

` curl -i -X PUT http://localhost:3000/artefact-/1/first/green `


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