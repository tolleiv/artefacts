var helper = require('./helper')

var showState = function (req, res, next) {
    var m = this.get('model').State.using(this.get('connection'));
    m.where('id = ?', req.params.id).first(
        helper.failOnError.bind(res, req, 'state', null, next)
    );
};

module.exports = function (app) {
    app.route("/states").get(function (req, res, next) {
        var m = app.get('model').State.using(app.get('connection')).orderBy('title')
        m.all(helper.failOnError.bind(res, req, 'state', null, next));
    }, helper.forwardResults);

    app.route("/state/:id")
        .get(
            showState.bind(app),
            helper.failOnEmptyResult.bind(null, "State not found"),
            helper.forwardResults
        )
        .put(
            function (req, res, next) {
                var m = app.get('model').State;
                m.update(app.get('connection'), req.params.id, req.body,
                    helper.failOnError.bind(res, req, 'state', 'updated', next)
                );
            },
            helper.failOnEmptyResult.bind(null, "State not found"),
            helper.emitResult.bind(app),
            showState.bind(app),
            helper.forwardResults
        )
        .delete(
            function (req, res, next) {
                var m = app.get('model').State.using(app.get('connection'))
                m.where('id = ?', req.params.id).deleteAll(
                    helper.failOnError.bind(res, req, 'state', 'deleted', next)
                );
            },
            helper.emitResult.bind(app),
            helper.forwardResults
        )

    app.route("/state").post(function (req, res, next) {
            var m = app.get('model')
            var p = new m.State(req.body);
            p.save(app.get('connection'),
                helper.failOnError.bind(res, req, 'state', 'created', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults
    );
}

