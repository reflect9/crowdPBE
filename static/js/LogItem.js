var LogItem = (function () {
    function LogItem(event, tid, detail) {
        this.time = Date.now();
        this.event = event;
        this.tid = tid;
        this.detail = detail;
    }
    return LogItem;
}());
//# sourceMappingURL=LogItem.js.map