var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the project API", function () {
    var request = helper.req;
    var respondsPositive = helper.req.respondsPositive
    var respondsNegative = helper.req.respondsNegative

    beforeEach(function () {
        var p1 = new models.Project({ title: "Foo1" })
        var p2 = new models.Project({ title: "Foo2" })
        var p3 = new models.Project({ title: "Foo3" })
        var p4 = new models.Project({ title: "Foo4" })

        runs(helper.start(persist, models, [
            p1, p2, p3, p4
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    it("lists existing projects", function (done) {
        request.get("/projects", respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Array));
            expect(body.length).toEqual(4);
            expect(body[0].title).toEqual('Foo1');

            done();
        }));
    });
    it("can show single projects", function (done) {
        request.get("/project/3", respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('Foo3');
            done();
        }));
    });
    it("raises an error when missing projects are accessed", function (done) {
        request.get("/project/0", respondsNegative(function () {
            done();
        }));
    });
    it("can create new projects", function (done) {
        request.post('/project', {title: 'Bar'}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('Bar');
            expect(body.id).toBeGreaterThan(4)
            done();
        }));
    });
    it("can update existing projects", function (done) {
        request.put('/project/3', {title: 'Bar'}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('Bar');
            expect(body.id).toEqual(3);
            done();
        }));
    });
    it("deletes existing projects", function (done) {
        request.del('/project/2', respondsPositive(function (body) {
            request.get("/project/2", function (err, res, body) {
                expect(res.statusCode).toEqual(404); // object can't be found
                done();
            });
        }));
    });
});
