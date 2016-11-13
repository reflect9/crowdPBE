class TaskModel {
	public mpbe: MixedPBE;
	public controller: TaskController;
	public view: TaskView;
	public attr: TaskDefinition;
	public trial: Trial;
	public previousTrials: Trial[];
	public programs: Object[];
	public startTimeStamp: number;
	public numberOfTrials: number; 

	constructor (taskAttributes: TaskDefinition, mixedPBE: MixedPBE) {
		// _.extend(this, pbeTasks[taskID]);
		this.attr = taskAttributes;
		this.mpbe = mixedPBE;
	}

	public isTutorial(): boolean {
		return this.attr.taskID.indexOf("tutorial") != -1;
	}

	public getReport(): Object {
		return {
			"trials": this.previousTrials,
			"programs": this.programs
		};
	}
}