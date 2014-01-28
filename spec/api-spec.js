var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the Api", function () {
    var request = helper.req;

    describe("when working with projects", function () {
      beforeEach(function () {
            var p1 = new models.Project({ title: "Foo1" })
            var p2 = new models.Project({ title: "Foo2" })
            var p3 = new models.Project({ title: "Foo3" })
            var p4 = new models.Project({ title: "Foo4" })
            runs(helper.start(persist, models ,[
                p1, p2, p3, p4
            ]));
            waitsFor(helper.isStarted);
        });
        afterEach(helper.stop);

        it("lists existing projects", function (done) {
            request.get("/", function(err, res, body) {
                expect(err).toBe(null);
                expect(res.statusCode).toEqual(200);
                expect(body.length).toBeGreaterThan(0);

                var result = JSON.parse(body);
                expect(result).toEqual(jasmine.any(Array));
                expect(result.length).toEqual(4);
                expect(result[0].title).toEqual('Foo1');

                done();
            });
        });

        it("can show single projects", function (done) {
            request.get("/project/3", function (err, res, body) {
                expect(err).toBe(null);
                expect(res.statusCode).toEqual(200);
                expect(body.length).toBeGreaterThan(0);

                var result = JSON.parse(body);
                expect(result).toEqual(jasmine.any(Object));
                expect(result.title).toEqual('Foo3');
                done();
            });
        });

        it("can create new projects", function (done) {
            request.post('/project', {title: 'Bar'}, function (err, res, body) {
                expect(err).toBe(null);
                expect(res.statusCode).toEqual(200);
                expect(body).toEqual(jasmine.any(Object));
                expect(body.title).toEqual('Bar');
                expect(body.id).toBeGreaterThan(4)
                done();
            });
        });
        it("can update existing projects", function (done) {
            request.put('/project/3', {title: 'Bar'}, function (err, res, body) {
                expect(err).toBe(null);
                expect(res.statusCode).toEqual(200);
                expect(body).toEqual(jasmine.any(Object));
                expect(body.title).toEqual('Bar');
                expect(body.id).toEqual(3);
                done();
            });
        });
        it("deletes existing projects", function(done) {
            request.del('/project/2', function(err, res, body) {
                expect(err).toBe(null);
                expect(res.statusCode).toEqual(200); // delete ok
                request.get("/project/3", function (err, res,body) {
                    expect(res.statusCode).toEqual(200); // object can't be found
                    done();
                })
            })
        });
    });
});
