The Model {+Metadata} {+Operations}
-----------------------------------

![Model UML](http://yuml.me/eca76789)

* statemachine { title, initialState } {CRUD}
* state {title, ttl} {CRUD}

* project {title} {CRUD}
* pipeline {title, stateMachine} {CRUD+ lastSuccessfulForState, cleanupArtefact}
* artefact {version, buildUrl, artefactPath, currentState} {CRUD+ }


Build status
------------

[![Build Status](https://travis-ci.org/tolleiv/artefacts.png?branch=master)](https://travis-ci.org/tolleiv/artefacts)


License
-------

This is free and unencumbered software released into the public domain. See the UNLICENSE file or http://unlicense.org/ for more details.