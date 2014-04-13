var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the state API", function () {
    var request = helper.req;
    var respondsPositive = helper.req.respondsPositive
    var respondsNegative = helper.req.respondsNegative

    beforeEach(function () {
        var sm = new models.StateMachine({ title: 'default'})
        var p1 = new models.Project({ title: "Foo1" })
        var pp11 = new models.Pipeline({title: "main", project: p1, statemachine: sm});
        var a11 = new models.Artefact({version: "0.0.1", pipeline: pp11});
        var s111 = new models.State({stage: 'build', person: 'me', artefact: a11})
        var s112 = new models.State({stage: 'installed', person: 'me', artefact: a11})

        runs(helper.start(persist, models, [
            sm, p1, pp11, a11, s111, s112
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    xit("lists states inline", function(done) {
        request.get("/artefact/1", respondsPositive(function (body) {
            var result = JSON.parse(body);
            expect(result).toEqual(jasmine.any(Object));
            // expect(result['states']['current']).toBeDefined();
            // expect(result.getCurrentState()).toEqual(Object)
            done();
        }));
    });
    xit("uses 'build' as initial state")

});

