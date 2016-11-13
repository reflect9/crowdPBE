/// <reference path="references.ts" />

class Log {
    public events: LogItem[];
    public workerID: String;
    constructor (workerID: String) {
        this.workerID = workerID;
    }
    public add(event: LogItem) {
        this.events.push(event);
    }
    public submit() {
        let xmlhttp: XMLHttpRequest;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                // CALLBACK HERE
            }
        }
        xmlhttp.open("POST", "submit", true);
        xmlhttp.send({
            data: JSON.stringify(this.events),
            workerID: this.workerID
        });
    }
    public toString(): string {
        return "tostring";
    }

}
