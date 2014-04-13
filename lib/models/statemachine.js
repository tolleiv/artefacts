var persist = require("persist");
var type = persist.type;

module.exports = StateMachine = persist.define("StateMachine", {
    "lastUpdated": { type: type.DATETIME },
    "title": { type: type.STRING }
});

StateMachine.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
}