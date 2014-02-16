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
        var pp12 = new models.Pipeline({title: "refactoring", project: p1});
        var a11 = new models.Artefact({version: "0.0.1", pipeline: pp11});
        var a12 = new models.Artefact({version: "0.0.2", pipeline: pp11});
        var a13 = new models.Artefact({version: "0.0.3", pipeline: pp11});

        runs(helper.start(persist, models, [
            p1, pp11, pp12, a11, a12, a13
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);
    it("lists related artefacts", function (done) {
        request.get("/pipeline/1/artefacts", respondsPositive(function (body) {
             var result = JSON.parse(body);
             expect(result).toEqual(jasmine.any(Array));
             expect(result.length).toEqual(3);
             expect(result[1].version).toEqual('0.0.2');
            done();
        }));
    });
    it("can show single artefacts", function (done) {
        request.get("/artefact/2", respondsPositive(function (body) {
            var result = JSON.parse(body);
            expect(result).toEqual(jasmine.any(Object));
            expect(result.version).toEqual('0.0.2');
            done();
        }));
    });
    it("can create artefacts", function (done) {
        request.post('/artefact', {version: '0.0.2', pipeline_id: 2}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.version).toEqual('0.0.2');
            expect(body.id).toBeGreaterThan(3)
            done();
        }));
    });
    it("fails when creating artefacts with equal versions", function(done) {
        request.post('/artefact', {version: '0.0.2', pipeline_id: 1}, respondsNegative(function (body) {
            expect(body.message).toContain('Wrong version')
            expect(body.message).toContain('already exists')
            done();
        }));
    });
    it("can update artefacts", function(done) {
        request.put('/artefact/3', {artefactPath: 'tolleiv', buildUrl: 'test'}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.artefactPath).toEqual('tolleiv');
            expect(body.buildUrl).toEqual('test');
            expect(body.id).toEqual(3);
            done();
        }));
    });
    it("deletes existing artefacts", function (done) {
        request.del('/artefact/3', respondsPositive(function (body) {
            request.get("/artefact/3", function (err, res, body) {
                expect(res.statusCode).toEqual(404); // object can't be found
                done();
            });
        }));
    });
});