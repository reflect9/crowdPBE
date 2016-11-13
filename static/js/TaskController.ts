

class TaskController {
	taskID: string;
	model: TaskModel;
	view: TaskView; 
	mpbe: MixedPBE;
	constructor (taskID: string, mixedPBE: MixedPBE) {
		this.taskID = taskID;
		this.mpbe = mixedPBE;
		
	}
	/* asdfasdf
	*/
	public connectAll(model:TaskModel, view:TaskView) {
		this.model = model;
		this.view = view;
		// CONNECT OTHERS
		this.model.controller = this;
		this.model.view = view;
		this.view.controller = this;
		this.view.model = model;
		this.model.mpbe = this.mpbe;
		this.view.mpbe = this.mpbe;
		
	}

	// DRIVER WHEN TEACH COMPUTER BUTTON IS CLICKED
	// IT RETRIEVES CURRENT EXAMPLE IN THE VIEW, AND GENERATE PROGRAMS
	// THEN IT TESTS WHETHER THE PROGRAM IS CORRECT, GENERATE FEEDBACK, 
	// AND LET THE TASKVIEW TO RENDER FEEDBACK  
	public teachComputer() {
		// EXTRACT TRIAL FROM THE VIEW
		let trial = this.view.extractTrial();
		let programs: Program[][] = this.generatePrograms(trial);
		
		var validationResult = this.generateFeedback(programs, trial, );
		var isEveryStepRight = validationResult['isEveryStepRight'];
		var numProgList = validationResult['numProgList'];
		// LOG
		this.mpbe.log.add(new LogItem("INFER_PROGRAM", this.taskID, {
			data:trial,
			programs:programs,
			numProgList:numProgList
		}));
		// SHOWING FEEDBACK 
		if(this.taskID=="tutorial_1")  { var isEveryStepRight=true; }
		// SHOW TEST PROGRAM PANEL IF EVERYSTEP IS RIGHT
		if(isEveryStepRight){
			// TESTING PROGRAM (INPUT AND OTUPUT ONLY)
			try{
				let tDef = TaskDefinition.getTaskDefinition(this.taskID);
				let programTestResult = tDef.testOutput(trial);	
			} catch(e) {
				var programTestResult = {
					isValid:false,
					message: e
				}	
			}
			this.mpbe.log.add(new LogItem("TEST_PROGRAM",this.taskID, {
					programs: programs,
					testResult: programTestResult
				}));
			if(programTestResult.isValid == true) {
				this.view.renderProgramTestResult("<span style='color:green;'>"+programTestResult.message+"</span>");
				this.mpbe.log.add(new LogItem("TASK_PASSED",this.taskID, {}));	
				if(this.taskID.indexOf("task")!=-1) { // IF IT IS REAL TASK, SHOW THE BUTTON TO MOVE ON	
					this.view.showButtonForNextSection();	
				} else { // THIS IS TUTORIAL
					if(this.taskID == "tutorial_filter_1") {
						$("div.endOfTutorial").removeClass("hidden");
					} else {
						// IF IT IS TUTORIAL, AUTOMATICALLY MOVE ON
						this.openSection($("div.section[tid='"+this.taskID+"']").next(".section").attr("tid"));	
					} 
				}
			} else {  // WHEN ALL STEPS SUCCEED, BUT PROGRAM FAILED
				// PROVIDE MORE DETAILED FEEDBACK
				this.view.renderProgramTestResult("<span style='color:red;'>"+MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM+"</span>");
			}
		} else {  // WHEN SOME STEPS FAILED
			this.view.renderProgramTestResult("<span style='color:red;'>"+MESSAGE_AMBIGUOUS_STEPS+"</span>");
		}
		
		// IF PARTICIPANTS SPENT TOO MUCH TIME AND INFERENCE TRIALS, LET HIM GIVE UP 
		if(isEveryStepRight == false) {
			// UNSUCCESSFUL TRIAL
			var minutesSpent = (Date.now()- this.model.startTimeStamp)/60000;
			if(this.model.numberOfTrials > REQUIRED_TRIALS && minutesSpent>REQUIRED_MINUTES) {
				if(this.model.isTutorial()) { // FOR TUTORIALS, SHOW HINTS
					this.view.renderSolution();
				} else { // FOR TASK, ALLOW GIVE UP
					this.view.renderGiveUp();
				}
			}
			this.model.numberOfTrials += 1;
		} else {
			// ALREADY PASSED THIS TASK
		}
	}



	// GENERATING PROGRAMS FOR THE CURRENT TRIAL OF THE MODEL 
	public generatePrograms(trial: Trial): Program[][] {
		let dataFlatArray = trial.getFlatArray(); 
		let programs_for_steps: Program[][] = [];
		for(var stepIndex=1; stepIndex<dataFlatArray.length; stepIndex++) {
			var previousSteps = dataFlatArray.slice(0,stepIndex);
			var currentStep = dataFlatArray[stepIndex];
			var generatedP_list = this.mpbe.crowdPlanner.inferSingleStep(previousSteps, currentStep);
			console.log("STEP "+stepIndex+ " ===========");
			_.each(generatedP_list, function(p){ console.log(JSON.stringify(p)); });
			if(generatedP_list && generatedP_list.length>0){
				programs_for_steps.push(generatedP_list);	
			} else {
				programs_for_steps.push([]);
			}
		}
		return programs_for_steps;
	};
	// START TASK TRIGGERED WHEN PARTICIPANTS CLICK EXAMPLE TABLE
	public startTask(){
		this.model.startTimeStamp = Date.now();
		this.model.numberOfTrials = 0;
		this.mpbe.log.add(new LogItem("START_TASK", this.taskID, {  }));
	}

	// GENERATING FEEDBACK
	public generateFeedback(programs: Program[][], data: Trial){
		///// STEP 1. GET NUMBER OF PROGRAMS PER STEP
		let num_prog_list: number[] = [];
		for(let programs_for_a_step of programs) {
			// EVALUATING PROGRAMS: 1. GROUP PROGRAMS BY THEIR INPUTS
			var programs_by_inputs = {};
			for(let single_program of programs_for_a_step) {
				if(single_program.param['inputIndex'] in programs_by_inputs==false) {
					programs_by_inputs[single_program.param['inputIndex']] = [];	
				} 
				programs_by_inputs[single_program.param['inputIndex']].push(single_program);
			}
			// 2. FIND MINIMUM # PROGRAMS FROM A INPUT THAT CAN REACH THE CURRENT ROW
			var minimum_number_of_programs_from_one_input; 
			if(_.keys(programs_by_inputs).length>0) {
				minimum_number_of_programs_from_one_input = _.min(_.map(programs_by_inputs, function(ps, inp){
					// return ps.length;
					return 0;
				}));	
			} else {
				minimum_number_of_programs_from_one_input = 0;
			}
			num_prog_list.push(minimum_number_of_programs_from_one_input);
		}
		/////// STEP 2. GENERATE FEEDBACK BASED ON THE CURRENT MODE
		var isEveryStepRight = true;
		let feedbackList: string[] = []; 
		if(this.mpbe.mode == MODE_FIXED) {
			for(let i in num_prog_list) {
				let num_prog = num_prog_list[i];
				if(num_prog == 0) { // NO PROGRAM IS FOUND
					feedbackList.push(MESSAGE_STEP_FAIL);
					isEveryStepRight = false;
				} else if(num_prog==1) {
					feedbackList.push(MESSAGE_STEP_SUCCESS);
				} else  if(num_prog>1) {
					feedbackList.push(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]", num_prog.toString()));
					isEveryStepRight = false;
				}
			}
		} else if(this.mpbe.mode == MODE_MIXED_TRIAL) { // ACTIONABLE FEEDBACK BASED ON THE LAST TRIAL ONLY
			for(let i:number = 0; i<num_prog_list.length; i++) {
				let num_prog = num_prog_list[i];
				if(num_prog == 0) { // NO PROGRAM IS FOUND
					var failAnalysis = Analyzer_MixedTrial.analyzeFailure(data, i);
					feedbackList.push(failAnalysis.html);
					this.mpbe.log.add(new LogItem("FAIL_MESSAGE", this.taskID, {
						data:data,
						code:failAnalysis.failCode
					}));
					isEveryStepRight = false;
				} else if(num_prog==1) {
					feedbackList.push(MESSAGE_STEP_SUCCESS);
				} else  if(num_prog>1) {
					feedbackList.push(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]", num_prog.toString()) + " Provide more examples.");
					isEveryStepRight = false;
				}		
			}
		} else if(this.mpbe.mode == MODE_MIXED_TASK) {
			// TBD. HOW TO GENERATE FEEDBACK BASED ON THE ENTIRE TRIALS
		} else if(this.mpbe.mode == MODE_MIXED_ALL) {
			// TBD. HOW TO GENERATE FEEDBACK BASED ON THE ENTIRE STUDY
		} 
		/////// STEP 3. LET THE TASK VIEWER TO RENDER FEEDBACK
		this.view.renderFeedback(feedbackList);
		/////// 
		return {
			isEveryStepRight:isEveryStepRight,
			numProgList:num_prog_list
		};
	}


	// GIVE UP A SINGLE TASK
	public giveUp() {
		this.mpbe.log.add(new LogItem("GIVE_UP_TASK", this.taskID, {}));	
		// WHAT TO SHOW NEXT
		var currentSection = $(".section[tid='"+this.taskID+"']");
		if(this.taskID == _.last(TaskDefinition.getAllIDs())) {	 // IF CURRENt TASK IS THe LAST ONE, THEN SHOW ENDOfTASK DIV
			$("div.endOfTask").removeClass("hidden");
		} else if($(currentSection).hasClass("lastTutorial")) {
			$("div.endOfTutorial").removeClass("hidden");
		} else {
			var taskEl = $("div.section[tid='"+this.taskID+"']");
			this.openSection($(taskEl).next(".section").attr("tid"));	
			// IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
			if(this.taskID.indexOf("task")!=-1) {	$(taskEl).addClass("hidden");	}
		}
	}

	public openSection(tid){
		var sectionEl = $("div.section[tid='"+tid+"']");
		if($(sectionEl).hasClass("hidden")) {
			$(sectionEl).removeClass("hidden").css("opacity","0").animate({opacity: 1.0}, 1000);
			this.mpbe.log.add(new LogItem("OPEN_SECTION", this.taskID, {}));
		}	
	}

	

}
