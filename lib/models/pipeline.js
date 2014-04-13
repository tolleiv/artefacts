var persist = require("persist");
var type = persist.type;

module.exports = Pipeline = persist.define("Pipeline", {
    "lastUpdated": { type: type.DATETIME },
    "title": { type: type.STRING, defaultValue: "main" }
})

Pipeline.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
}