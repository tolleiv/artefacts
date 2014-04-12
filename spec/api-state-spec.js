var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the artefact API", function () {
    var request = helper.req;
    var respondsPositive = helper.req.respondsPositive
    var respondsNegative = helper.req.respondsNegative

    beforeEach(function () {
        var p1 = new models.Project({ title: "Foo1" })
        var pp11 = new models.Pipeline({title: "main", project: p1});
        var a11 = new models.Artefact({version: "0.0.1", pipeline: pp11});

        runs(helper.start(persist, models, [
            p1, pp11, a11
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    it("lists states inline", function(done) {
        request.get("/artefact/1", respondsPositive(function (body) {
            var result = JSON.parse(body);
            expect(result).toEqual(jasmine.any(Object));
            expect(result['states']['current']).toEqual(jasmine.any(String));
            // expect(result.getCurrentState()).toEqual(Object)
            done();
        }));
    });
    it("uses 'build' as initial state")

});

