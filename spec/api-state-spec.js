var helper = require('./spec-helper');
var persist = require("persist");
var models = require('../lib/models');

describe("the state API", function () {
    var request = helper.req;
    var respondsPositive = helper.req.respondsPositive
    var respondsNegative = helper.req.respondsNegative

    beforeEach(function () {
        var s11 = new models.State({ title: 'first'});
        var s12 = new models.State({ title: 'second'});
        var s13 = new models.State({ title: 'third'});

        runs(helper.start(persist, models, [
            s11, s12, s13
        ]));
        waitsFor(helper.isStarted);
    });
    afterEach(helper.stop);

    it("can show single states", function (done) {
        request.get("/state/2", respondsPositive(function (body) {
            var result = JSON.parse(body);
            expect(result).toEqual(jasmine.any(Object));
            expect(result.title).toEqual('second');
            done();
        }));
    });
    it("can create states", function (done) {
        request.post('/state', {title: 'forth'}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('forth');
            expect(body.id).toBeGreaterThan(3)
            done();
        }));
    });
    it("can update states", function (done) {
        request.put('/state/1', {timeToRed: '3'}, respondsPositive(function (body) {
            expect(body).toEqual(jasmine.any(Object));
            expect(body.title).toEqual('first');
            expect(body.timeToRed).toEqual(3);
            expect(body.id).toEqual(1);
            done();
        }));
    });
    it("deletes existing artefacts", function (done) {
        request.del('/state/1', respondsPositive(function (body) {
            request.get("/state/1", function (err, res, body) {
                expect(res.statusCode).toEqual(404); // object can't be found
                done();
            });
        }));
    });
});