var Log = (function () {
    function Log(workerID) {
        this.workerID = workerID;
    }
    Log.prototype.add = function (event) {
        this.events.push(event);
    };
    Log.prototype.submit = function () {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            }
        };
        xmlhttp.open("POST", "submit", true);
        xmlhttp.send({
            data: JSON.stringify(this.events),
            workerID: this.workerID
        });
    };
    Log.prototype.toString = function () {
        return "tostring";
    };
    return Log;
}());
//# sourceMappingURL=Log.js.map