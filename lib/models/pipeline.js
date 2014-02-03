var persist = require("persist");
var Project = require("./project");
var type = persist.type;

module.exports = Pipeline = persist.define("Pipeline", {
  "lastUpdated": { type: type.DATETIME },
  "title": { type: type.STRING, defaultValue: "main" }
})
  .hasOne(Project);

Pipeline.onSave = function(obj, connection, callback) {
  obj.lastUpdated = new Date();
  callback();
}