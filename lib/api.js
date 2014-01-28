var express = require('express')

var app = express();
exports.app = app;

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
app.use(express.json());
app.use(express.methodOverride());

app.get("/", function (req, res) {
   var m =  app.get('model').Project.using(app.get('connection'))
   m.all(function (err, p) {
       err ? res.json(500, err) : res.json(200, p);
    });
});

function showProject (req, res) {
    var m =  app.get('model').Project.using(app.get('connection'))
    m.where('id = ?', req.params.id).first(function (err, p) {
        err ? res.json(500, err) : res.json(200, p);
    });
}

app.get("/project/:id", showProject);

app.post("/project", function (req, res) {
    var m = app.get('model')
    var p = new m.Project(req.body);
    p.save(app.get('connection'), function (err) {
        err ? res.json(500, err) : res.json(200, p);
    });
});
app.put("/project/:id", function (req, res, next) {
    var m =  app.get('model').Project
    m.update(app.get('connection'), req.params.id, req.body, function (err, result) {
        err ? res.json(500, err) : next();
    });
}, showProject);

app.del("/project/:id", function(req, res) {
    var m =  app.get('model').Project.using(app.get('connection'))
    m.where('id = ?', req.params.id).deleteAll(function (err) {
        err ? res.json(500, err) : res.json(200);
    });
})

if (__filename == process.argv[1]) {
    app.listen(3000);
}