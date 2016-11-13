class Trial {
    public input: string[] = [];
    public steps: string[][] = [];
    public output: string[] = [];
    public timeStamp: number = -1;
    public programs: Program[];
    public feedbacks: string[][]; 
    
    public getFlatArray(): string[][] {
        return [this.input].concat(this.steps).concat(this.output);
    }
    public getStepNum(): Number {
        return this.steps.length;
    }
    public getCaseNum(): Number {
        return this.input.length;
    }

   
}