class LogItem {
    event: string;
    tid: string;
    detail: Object;
    time: Number = Date.now();
    constructor(event:string, tid:string, detail:Object){
        this.event = event;
        this.tid = tid;
        this.detail = detail;
    }
}