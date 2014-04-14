var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the state API", function () {
    var request = helper.req;
    var redirectsTo = helper.req.redirectsTo

    beforeEach(function () {
        var s11 = new models.State({ title: 'first'});
        var s12 = new models.State({ title: 'second'});
        var s13 = new models.State({ title: 'third'});

        var p1 = new models.Project({ title: "myProject" });
        var p2 = new models.Project({ title: "yourProject" });
        var pp11 = new models.Pipeline({title: "mainPipe11", project: p1 });
        var pp12 = new models.Pipeline({title: "refactoring", project: p1 });
        var pp22 = new models.Pipeline({title: "refactoring", project: p2 });
        var a11 = new models.Artefact({version: "0.0.1", pipeline: pp11});
        var a12 = new models.Artefact({version: "0.0.2", pipeline: pp11});
        var a13 = new models.Artefact({version: "0.0.3", pipeline: pp11});
        var a21 = new models.Artefact({version: "0.0.1", pipeline: pp22});

        runs(helper.start(persist, models, [
            s11, s12, s13, p1, p2, pp11, pp12, pp22, a11, a12, a13, a21
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    it("redirects state creation along the readable path names of the artefact", function (done) {
        request.put('/c/yourProject/refactoring/0.0.1/first/yellow', {buildUrl: 'ur://l'},
            redirectsTo('/artefact/4/1/yellow', done)
        );
    });
});