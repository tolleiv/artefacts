module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render('index')
    });

    app.get("/ui/projects", function (req, res) {
        res.render('project-overview')
    });
    app.get("/ui/pipelines", function (req, res) {
        res.render('index')
    });
    app.get("/ui/artefacts", function (req, res) {
        res.render('index')
    });
    app.get("/ui/states", function (req, res) {
        res.render('index')
    });
}

