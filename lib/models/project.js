var persist = require("persist");
//var Pipeline = require("./pipeline");
var type = persist.type;

module.exports = Project = persist.define("Project", {
  "lastUpdated": { type: type.DATETIME },
  "title": { type: type.STRING }
})
//  .hasMany(Pipeline, { through: "pipelines" });

Project.onSave = function(obj, connection, callback) {
  obj.lastUpdated = new Date();
  callback();
}