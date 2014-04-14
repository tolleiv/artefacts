var helper = require('./helper')

module.exports = function (app) {
    app.put("/c/:project/:pipeline/:artefact/:state/:code", function (req, res, next) {


        helper.resolveRelatedObjectsBySlug(app, req.params,
            function(models) {
                //console.log(models);
                var parts = ["/artefact"];
                parts.push(models.artefact.id);
                parts.push(models.state.id);
                parts.push(req.params.code);

                res.redirect(parts.join('/'))

            },
            helper.forwardOrFail.bind(res, 409)
        );


        // create update state



    });
};

