var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the compound API", function () {
    var request = helper.req;
    var redirectsTo = helper.req.redirectsTo;
    var respondsPositive = helper.req.respondsPositive;
    var respondsNegative = helper.req.respondsNegative;

    beforeEach(function () {
        var s11 = new models.State({ title: 'first'});
        var s12 = new models.State({ title: 'second'});
        var s13 = new models.State({ title: 'third'});

        var p1 = new models.Project({ title: "myProject" });
        var pp11 = new models.Pipeline({title: "mainPipe11", project: p1 });

        var a11 = new models.Artefact({version: "0.0.1", pipeline: pp11});
        var as111 = new models.ArtefactState({artefact: a11, state: s11, code: 'green'  ,lastUpdated: 10000});
        var as112 = new models.ArtefactState({artefact: a11, state: s12, code: 'red'    ,lastUpdated: 20000});

        var a12 = new models.Artefact({version: "0.0.2", pipeline: pp11});
        var as121 = new models.ArtefactState({artefact: a12, state: s11, code: 'green'  ,lastUpdated: 30000});
        var as122 = new models.ArtefactState({artefact: a12, state: s12, code: 'green'  ,lastUpdated: 40000});
        var as123 = new models.ArtefactState({artefact: a12, state: s13, code: 'green'  ,lastUpdated: 50000});

        var a13 = new models.Artefact({version: "0.0.3", pipeline: pp11});
        var as131 = new models.ArtefactState({artefact: a13, state: s11, code: 'yellow' ,lastUpdated: 60000});

        var pp12 = new models.Pipeline({title: "refactoring", project: p1 });

        var p2 = new models.Project({ title: "yourProject" });
        var pp22 = new models.Pipeline({title: "refactoring", project: p2 });
        var a21 = new models.Artefact({version: "0.0.1", pipeline: pp22});

        runs(helper.start(persist, models, [
            s11, s12, s13, p1, p2, pp11, pp12, pp22, a11, a12, a13, a21, as111, as112, as121, as122, as123, as131
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    it("provides a speaking url for state creation", function (done) {
        request.put('/c/yourProject/refactoring/0.0.1/first/yellow', {buildUrl: 'ur://l'},
            redirectsTo('/artefact/4/1/yellow', done)
        );
    });

    it("can create artefacts and with their state relations", function (done) {
        request.post('/c/yourProject/refactoring/0.0.2/first/green', {buildUrl: 'ur://l'},
            respondsPositive(function (body) {
                expect(body).toEqual(jasmine.any(Object))
                expect(body.version).toEqual('0.0.2')
                expect(body.buildUrl).toEqual('ur://l')
                expect(body.artefactstates[0].code).toEqual('green');
                expect(body.artefactstates[0].buildUrl).toEqual('ur://l')
                done();
            })
        );
    });

    it("can't recreate existing artefacts", function (done) {
        request.post('/c/yourProject/refactoring/0.0.1/first/green', {},
            respondsNegative(function (body) {
                expect(body.message).toContain('Wrong version');
                expect(body.message).toContain('already exists');
                done();
            })
        );
    });

    validStates = {
        'second/green': '0.0.2',
        'second/red': '0.0.1',
        'third/green': '0.0.2',
        'first/green': '0.0.2',
        'first/yellow': '0.0.3'
    }

    for (s in validStates) {
        (function(state, version) {
            it("can return artefacts with specific state [" + state + "] requirement", function(done) {
                request.get('/c/myProject/mainPipe11/' + state, respondsPositive(function(body) {
                    expect(body).toEqual(jasmine.any(Object))
                    expect(body.version).toEqual(version)
                    done();
                }))
            })
        })(s, validStates[s]);
    }

    invalidStates = {
        'first/red': 'artefact not found',
        'some/blue': 'state invalid'
    }
    for (s in invalidStates) {
        (function(state, error) {
            it("throws 404s if states requirement is not matching [" + state + "]", function(done) {
                request.get('/c/myProject/mainPipe11/' + state, respondsNegative(function(body, code) {
                    expect(code).toEqual(404)
                    expect(JSON.stringify(body).toLowerCase()).toContain(error)
                    done();
                }))
            })
        })(s, invalidStates[s]);
    }

    it("is able to generate some basic statistics", function (done) {
        request.get('/c/statistics', respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.projects).toEqual(2);
            expect(body.pipelines).toEqual(3);
            expect(body.artefacts).toEqual(4);
            expect(body.states.green).toEqual(4);
            expect(body.states.red).toEqual(1);
            expect(body.states.yellow).toEqual(1);
            done();
        }));
    });
    it("it includes zero counts within statistics", function (done) {
        models.Project.deleteAll(helper.persistConnection(),
            function () {
                request.get('/c/statistics', respondsPositive(function (body) {
                    expect(body).toEqual(jasmine.any(Object));
                    expect(body.projects).toEqual(0);
                    done();
                }));
            });
    });
});