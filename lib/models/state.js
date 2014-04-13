var persist = require("persist");
var type = persist.type;

module.exports = State = persist.define("State", {
    "lastUpdated": { type: type.DATETIME },
    "time_to_red": { type: type.INTEGER },
    "title": { type: type.STRING }
})

State.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
}