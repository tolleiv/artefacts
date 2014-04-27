var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the pipeline API", function () {
    var request = helper.req;
    var respondsPositive = helper.req.respondsPositive
    var respondsNegative = helper.req.respondsNegative

    beforeEach(function () {
        var p1 = new models.Project({ title: "Foo1" })
        var p2 = new models.Project({ title: "Foo2" })
        var pp11 = new models.Pipeline({title: "mainPipe11", project: p1 });
        var pp12 = new models.Pipeline({title: "refactoring", project: p1 })
        var pp21 = new models.Pipeline({title: "mainPipe21", project: p2 })

        runs(helper.start(persist, models, [
            p1, p2, pp11, pp12, pp21
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);
    it("lists existing pipelines", function (done) {
        request.get("/project/1/pipelines", respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Array));
            expect(body.length).toEqual(2);
//            expect(result[1].title).toEqual('refactoring');

            done();
        }));
    });
    it("can show single pipelines", function (done) {
        request.get("/pipeline/2", respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('refactoring');
            done();
        }));
    });
    it("can create pipelines", function (done) {
        request.post('/pipeline', {title: 'relaunch', project_id: 2}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('relaunch');
            expect(body.id).toBeGreaterThan(3)
            done();
        }));
    });
    it("doesn't create a pipeline with invalid projects", function (done) {
        request.post('/pipeline', {title: 'fail', project_id: 100}, respondsNegative(function (body) {
            expect(JSON.stringify(body).toLowerCase()).toContain('project invalid')
            done();
        }));
    });
    it("can update pipelines", function (done) {
        request.put('/pipeline/2', {title: 'relaunch'}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('relaunch');
            expect(body.id).toEqual(2);
            done();
        }));
    });
    it("will not move pipelines to other projects", function (done) {
        request.put('/pipeline/2', {title: 'relaunch', project_id: 2}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.projectId).toEqual(1);
            done();
        }));
    });
    it("deletes existing pipelines", function (done) {
        request.del('/pipeline/2', respondsPositive(function (body) {
            request.get("/pipeline/2", function (err, res, body) {
                expect(res.statusCode).toEqual(404);
                done();
            });
        }));
    });
});
