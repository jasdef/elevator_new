var event = [];

function timer() {
    setInterval(update, 60000);
}

timer.prototype.addtimer = function (key, time, callback) {
    event.push({ key: [key, time, callback] });
    common.log("system", "addtimer - " + JSON.stringify({ key: [key, time, callback] }));
};

timer.prototype.removetimer = function (key) {
    common.log("system", "removetimer - " + JSON.stringify(key));
    for (i = 0; i < event.length; i++) {
        if (event[i].key[0] === key) {
            common.log("system", "removetimer_check - " + JSON.stringify(event[i]));
            event.splice(i, 1);
            return;
        }
    }
};

update = function () {
    var now = new Date(Date.now())
    var length = event.length - 1;
    for (i = length; i >= 0; i--) {
        if (now >= new Date(event[i].key[1])) {
            event[i].key[2](event[i].key[0]);
            event.splice(i, 1);
        }
    }
}

module.exports = new timer;