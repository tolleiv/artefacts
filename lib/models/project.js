var persist = require("persist");
var type = persist.type;

module.exports = Project = persist.define("Project", {
  "lastUpdated": { type: type.DATETIME },
  "title": { type: type.STRING }
})

Project.onSave = function(obj, connection, callback) {
  obj.lastUpdated = new Date();
  callback();
}