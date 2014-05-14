module.exports = function (app) {
    app.route("/").get(function (req, res) {
        res.render('index')
    });
    app.route("/ui/projects").get(function (req, res) {
        res.render('project-overview')
    });
    app.route("/ui/pipelines").get(function (req, res) {
        res.render('index')
    });
    app.route("/ui/artefacts").get(function (req, res) {
        res.render('index')
    });
    app.route("/ui/states").get(function (req, res) {
        res.render('state-overview')
    });
}

