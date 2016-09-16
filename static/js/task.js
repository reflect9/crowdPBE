// task_id_list = _.shuffle(["task_group_score","task_extract","task_sort","task_reduce","task_conditional_replace"]);
task_id_list = _.filter(_.keys(pbeTasks), function(k){return k.indexOf("task")!=-1; });
MESSAGE_INSUFFICIENT_EXAMPLES = "Insufficient examples. You can provide more cases or elaborate current examples. ";
MESSAGE_INSUFFICIENT_STEPS = "Failed to find a program matching with the examples. It might need more steps?";
// FEEDBACK FOR INDIVIDUAL STEPS
MESSAGE_STEP_FAIL = `<i class='fa fa-ban' aria-hidden='true'></i>
						Found no program that calculates this step for one of the above steps.`;
MESSAGE_STEP_WARNING = `<i class='fa fa-exclamation-circle' aria-hidden='true'></i>
						Found [minimum_num_prog] programs that calculate this step.`;
MESSAGE_STEP_SUCCESS = `<i class='fa fa-check-circle' aria-hidden='true'></i>
						Found a single program that calcuates the step.`;
// FEEDBACK FOR ALL STEPS
MESSAGE_AMBIGUOUS_STEPS = "An inconsistent set of programs was returned for the different examples provided. Try to fix every step to have single programs.";
MESSAGE_EXCEPTION = "Unexpected error. Make sure values have no typo.";
// TESTING PROGRAM
MESSAGE_PASS = "Good job! The computer learned the correct program.";
MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM = "The computer learned a wrong program.";
//
MODE_EXPERIMENTAL = "experimental";

//
REQUIRED_MINUTES = 0;
REQUIRED_TRIALS = 5;

var generateAllTutorials = function() {
	var tutorial_tid_list = _.filter(_.keys(pbeTasks), function(tid){ return tid.indexOf("tutorial") != -1;});
	console.log("TUTORIALS");
	console.log(tutorial_tid_list);
	for(var i=0; i<tutorial_tid_list.length; i++) {
		var tid = tutorial_tid_list[i];
		var sectionEl = $("<div class='section hidden' tid='"+tid+"'></div>");
		if(i==0) $(sectionEl).removeClass("hidden");
		if(i==tutorial_tid_list.length-1) $(sectionEl).addClass("lastTutorial");
		$(sectionEl).insertBefore($("div.tutorial_container div.endOfTutorial"));
		generateSingleTask(tid, sectionEl);		
	}
};
var generateAllTasks = function() {
	var taskContainerEl = $("div.task_container");
	// var task_id_list = _.shuffle(["task_filter","task_extract","task_sort","task_reduce","task_conditional_replace"]);
	$("span#numTasks").text(task_id_list.length);
	_.each(task_id_list, function(tid, index){
		var sectionEl = $("<div class='section hidden' tid='"+tid+"'></div>")
			.insertBefore($("div.task_container div.endOfTask"));
		$("<h3>Task "+(index+1)+"</h3>").appendTo(sectionEl);
		generateSingleTask(tid, sectionEl, index);
	});
};

var generateSingleTask = function(tid, sectionElement, index) {
	var tData = pbeTasks[tid];
	var instructionEl = $("<div class='instruction'></div>").html(tData['instruction']);
	$(instructionEl).appendTo(sectionElement);
	// CREATING INNER CONTENT OF DIV.TASK
	var taskEl = $("<div class='task' tid='"+tid+"'>\
					<div class='program'>\
			        	<div class='header'>TASK <span class='t_desc'>"+tid+"</span></div>\
			        	<div class='description'></div>\
					</div>\
					<div class='examples'>\
						<div class='header'>EXAMPLES</div>\
						<table class='inAndOut'>\
							<tr class='input'>\
								<th>Input</th>\
							</tr>\
							<tr class='output'>\
								<th>Output</th>\
							</tr>\
							<tr class='lastRow'><th></th></tr>\
						</table>\
					</div>\
					<div class='test'>\
						<div class='header'>RESULT</div>\
						<div class='inference'>\
							<button class='teachButton'>Teach Computer</button>\
							<div class='testResult'></div>\
							<div style='clear:both;'></div>\
						</div>\
						<button class='openNextSection hidden'>Next Task</button>\
					</div>\
					<div class='giveup hidden'>\
						It seems that you are having trouble with this task.\
	    				You can <button class='giveup_button'>give up, and proceed to the next task</button></div>\
					</div>\
				</div>").appendTo(sectionElement);
	// PROGRAM DESCRIPTION
	$(taskEl).find(".description").text(tData['description']);
	// CREATE INITIAL INPUT AND OUTPUT DATA
	$(taskEl).find(".description").text(tData['description']);
	for(var i=0;i<tData['example']['input'].length;i++) {
		$(taskEl).find("tr.input").append("<td contenteditable='true'>"+tData['example']['input'][i]+"</td>");
	}
	for(var i=0;i<tData['example']['output'].length;i++) {
		$(taskEl).find("tr.output").append("<td contenteditable='true'>"+tData['example']['output'][i]+"</td>");
		$(taskEl).find("tr.lastRow").append("<td><div class='removeCase hidden'>&#10005;</div></td>");
	}
	if(tData['example']['steps']) {
		for(var i=0;i<tData['example']['steps'].length;i++) {
			var stepData = tData['example']['steps'][i];
			var stepEl = $("<tr class='step'><th><div class='removeStep'>&#9988;</div>Step<div class='addStep'>+</div></th></tr>");
			for(var j=0;j<stepData.length;j++) {
				$(stepEl).append("<td contenteditable='True'>"+stepData[j]+"</td>");
			}
			$(stepEl).append("<td class='lastColumn'></td>");
			$(stepEl).insertBefore($(taskEl).find("tr.output"));
		}	
	}
	
	// CREATE LAST INPUT ANd OUTPUT TD
	// $(taskEl).find("tr.input").append("<td contenteditable='true'></td>");
	// $(taskEl).find("tr.output").append("<td contenteditable='true'></td>");
	// $(taskEl).find("tr.lastRow").append("<td><div class='removeCase hidden'>&#10005;</div></td>");
	// BUTTON FOR ADDING CASE
	if(tData['features']['addCase']) $(taskEl).find("tr.input").append("<td class='lastColumn' rowspan=0><button class='addCase'>Add Case</button></td>");
	// PLACES TO SHOW INFERENCE FEEDBACK FOR FOR THE OUTpUT
	$(taskEl).find("tr.output").append("<td class='lastColumn' rowspan=0></td>");	

	// EVENTHANDER FOR OPENNEXTSECTION
	$(taskEl).find("button.openNextSection").click(function(){
		var currentSection = $(this).parents(".section");
		var tid = $(currentSection).attr("tid");
		if(tid==task_id_list[task_id_list.length-1]) {
			// IF CURRENt TASK IS THe LAST ONE, THEN SHOW ENDOfTASK DIV
			$("div.endOfTask").removeClass("hidden");
		} else {
			var nextSectionTID = $(currentSection).next(".section").attr("tid");
			openSection(nextSectionTID);
			// IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
			$(currentSection).addClass("hidden");
		}
	});
	// EVENTHANDLER FOR ShoWING SOLUTION
	$(taskEl).on("click","button.butShowSolution",function(event) {
		$(event.target).parents("div.testResult").find("table.simple").removeClass("hidden");
		$(event.target).parents("div.testResult").find("span.failResult").text("Here is one possible solution.");
		$(event.target).addClass("hidden");
	})


	// EVENTHANDLER OF STARTING TASK
	$(taskEl).on("click.dd", "", function() {
		var tid = $(this).attr("tid"); 
		$(this).off("click.dd");
		startTask(tid);
	});
	////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	// STEP ADD / REMOVE
	if(tData['features']['addStep']) $(taskEl).find("tr.input th").append("<div class='addStep'>+</div>");
	$(taskEl).on("click",".addStep", function(event){
		var buttonEl = event.target;
		var prevTr = $(buttonEl).parents("tr");
		var tableEl = $(buttonEl).parents("table.inAndOut");
		var currentNumCases = $(tableEl).find("tr.output td:not(.lastColumn)").length;
		var stepEl = $("<tr class='step'><th><div class='removeStep'>&#9988;</div>Step<div class='addStep'>+</div></th></tr>");
		for(var i=0;i<currentNumCases; i++) {
			$(stepEl).append("<td contenteditable='True'></td>");
		}
		$(stepEl).append("<td class='lastColumn'></td>");
		$(prevTr).after(stepEl);
	});
	$(taskEl).on("click",".removeStep", function(event){
		$(event.target).parents("tr.step").remove();
	});
	////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	// CASE ADD/REMOVE
	$(taskEl).on("click",".addCase", function(event){
		var buttonEl = event.target;
		var tableEl = $(buttonEl).parents("table.inAndOut");
		$(tableEl).find("tr.input > td.lastColumn").before("<td contenteditable='True'></td>");
		$(tableEl).find("tr.step > td.lastColumn").before("<td contenteditable='True'></td>");
		$(tableEl).find("tr.output > td.lastColumn").before("<td contenteditable='True'></td>");
		$("<td><div class='removeCase hidden'>&#10005;</div></td>").insertBefore($(tableEl).find("tr.lastRow td:last"));
	});
	$(taskEl).on("click",".removeCase", function(event){
		var currentNumCases = $(event.target).parents("tr").find("td:not(.lastColumn)").length;
		if(currentNumCases>1) {
			var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index($(event.target).parents("td"));
			$(event.target).parents("table.inAndOut").find("tr").find("td:nth("+id+")").remove();	
		}	
	});
	///// MOUSE HOVERING
	$(taskEl).on('mouseenter',"td:not(.lastColumn)",function(event){
		var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
		$(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
		$(event.target).parents("table.inAndOut").find("tr.lastRow td:nth("+id+") div.removeCase").removeClass("hidden");
	});
	$(taskEl).on('mouseleave',"td:not(.lastColumn)",function(event){
		var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
		$(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
	});
	////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	// TEACH COMPUTER BUTTON
	$(taskEl).find("button.teachButton").click(function(event, ui){
		var taskEl = $(event.target).parents("div.task");
		var tid = $(taskEl).attr("tid");
		// PREPARING DATA
		var data = extractDataFromTaskEl(taskEl);
		Data[tid] = data;
		// GENERATING PROGRAMS FOR INDIVIDUAL STEPS
		programs = generatePrograms(data);
		var validationResult = validateProgramsAndShowFeedback(programs, data, taskEl);
		var isEveryStepRight = validationResult['isEveryStepRight'];
		var numProgList = validationResult['numProgList'];
		// LOG
		Log.push({
	    	event:"INFER_PROGRAM",
	    	tid:$(taskEl).attr('tid'),
	    	detail:{
	    		data:data,
	    		programs:programs,
	    		numProgList:numProgList
	    	},
	    	time:Date.now()
	    });
	    Programs[tid] = programs;
		// SHOWING FEEDBACK 
		if(tid=="tutorial_1")  { var isEveryStepRight=true; }
		// SHOW TEST PROGRAM PANEL IF EVERYSTEP IS RIGHT
		if(isEveryStepRight){
			// TESTING PROGRAM (INPUT AND OTUPUT ONLY)
			try{
				var programTestResult = pbeTasks[tid]["testOutput"](Data[tid]);	
			} catch(e) {
				var programTestResult = {
					isValid:false,
					message: e
				}	
			}
			Log.push({
		    	event:"TEST_PROGRAM",
		    	tid:tid,
		    	detail:{
		    		programs: programs,
		    		testResult: programTestResult
		    	},
		    	time:Date.now()
		    });
			if(programTestResult.isValid == true) {
				$(taskEl).find(".testResult").html("<span style='color:green;'>"+programTestResult.message+"</span>");
		      	Log.push({
					event:"TASK_PASSED", 
					tid: tid,
					detail: {
					},
					timestamp:Date.now()
				});	
		      	if(tid.indexOf("task")!=-1) {	
		      		// IF IT IS REAL TASK, SHOW THE BUTTON TO MOVE ON
					$(taskEl).parents("div.section").find(".openNextSection").removeClass("hidden");	
				} else {
					if($(taskEl).parents("div.section").hasClass("lastTutorial")) {
						$("div.endOfTutorial").removeClass("hidden");
					} else {
						// IF IT IS TUTORIAL, AUTOMATICALLY MOVE ON
						openSection($("div.section[tid='"+tid+"']").next(".section").attr("tid"));	
					} 
					
				}
			} else {  // WHEN ALL STEPS SUCCEED, BUT PROGRAM FAILED
				// PROVIDE MORE DETAILED FEEDBACK

		      $(taskEl).find(".testResult").html("<span style='color:red;'>"+programTestResult.message+"</span>");;
		    }
		} else {  // WHEN SOME STEPS FAILED
			$(taskEl).find(".testResult").html("<span style='color:red;'>"+MESSAGE_AMBIGUOUS_STEPS+"</span>");
		}//
		// IF PARTICIPANTS SPENT TOO MUCH TIME AND INFERENCE TRIALS, LET HIM GIVE UP 
	    if(isEveryStepRight == false && Timer[tid]) {
	    	// UNSUCCESSFUL TRIAL
	    	var minutesSpent = (Date.now()- Timer[tid]['start_stamp'])/60000;
	    	if(Timer[tid]['trials']>REQUIRED_TRIALS && minutesSpent>REQUIRED_MINUTES) {
	    		if(tid.indexOf("tutorial")!=-1) { // FOR TUTORIALS, SHOW HINTS
	    			showSolution(tid, programs, taskEl);
	    		} else { // FOR TASK, ALLOW GIVE UP
	    			$(taskEl).find(".giveup").removeClass("hidden");
	    		}
	    	}
	    	Timer[tid]['trials'] += 1;
	    } else {
	    	// ALREADY PASSED THIS TASK
	    }
	});
	// GIVEUP
	$(taskEl).find("button.giveup_button").click(function(){
		giveUpTask($(event.target).parents("div.task").attr("tid"));
		$(this).off("click");
	});


};
function generatePrograms(data) {
	var dataFlatArr = [data['input']].concat(data['steps']).concat([data['output']]);
    var programs_for_steps=[];
    // ITERATING STEP1, STEP2, ..., OUTPUT TO GENERATE MATCHING PROGRAMS
	for(var stepIndex=1; stepIndex<dataFlatArr.length; stepIndex++) {
		var previousSteps = dataFlatArr.slice(0,stepIndex);
		var currentStep = dataFlatArr[stepIndex];
		var generatedP_list = CrowdPlanner.inferSingleStep(previousSteps, currentStep);
		// CONSOLE OUT
		console.log("STEP "+stepIndex+ " ===========");
		_.each(generatedP_list, function(p){ console.log(JSON.stringify(p)); });
		//
		if(generatedP_list && generatedP_list.length>0){
			programs_for_steps.push(generatedP_list);	
		} else {
			programs_for_steps.push([]);
		}
	}
	return programs_for_steps;
};
function validateProgramsAndShowFeedback(programs, data, taskEl){
	var num_prog_list = [];
	var tid = $(taskEl).attr("tid");
	for(var iStep in programs) {
		var programs_for_a_step = programs[iStep];
		// EVALUATING PROGRAMS: 1. GROUP PROGRAMS BY THEIR INPUTS
		var programs_by_inputs = {};
		for(var iProg in programs_for_a_step) {
			var single_program = programs_for_a_step[iProg];
			if(single_program.param.inputIndex in programs_by_inputs==false) {
				programs_by_inputs[single_program.param.inputIndex] = [];	
			}
			programs_by_inputs[single_program.param.inputIndex].push(single_program);
		}
		// 2. FIND MINIMUM # PROGRAMS FROM A INPUT THAT CAN REACH THE CURRENT ROW
		var minimum_number_of_programs_from_one_input; 
		if(_.keys(programs_by_inputs).length>0) {
			minimum_number_of_programs_from_one_input = _.min(_.map(programs_by_inputs, function(ps, inp){
				return ps.length;
			}));	
		} else {
			minimum_number_of_programs_from_one_input = 0;
		}
		num_prog_list.push(minimum_number_of_programs_from_one_input);
	}
	// 
	var isEveryStepRight = true;
	for(var i=0; i<num_prog_list.length; i++){
		var minimum_num_prog = num_prog_list[i];
		////// GIVING FEEDBACK FOR EACH STEP 
		var tr = (i<num_prog_list.length-1)? $(taskEl).find("tr.step").get(i): $(taskEl).find("tr.output").get(0);
		var lastColumn = $(tr).find("td.lastColumn");
		if(minimum_num_prog==0) {  // NO PROGRAM IS GENERATED FOR THE STEP
			if(mode == MODE_EXPERIMENTAL) {
				// EXPERIMENTAL. PROVIDE RICH, ACTIONABLE FEEDBACKS
				$(lastColumn).html(generateFailMessage(data, i, tr));
			} else {   // BASELINE. PROVIDE # PROGRAMS ONLY
				$(lastColumn).html(MESSAGE_STEP_FAIL);
			}
			$(lastColumn).attr("status","fail");
			isEveryStepRight = false;
		} else if(minimum_num_prog==1) { // BEST CASE.  CREATED ONE PRGRAM
			$(lastColumn).attr("status","success");
			$(lastColumn).html(MESSAGE_STEP_SUCCESS);
		} else if(minimum_num_prog>1) { // INSUFFICIENT EXAMPLE. CREATED MULTIPLE PROGRAMS.
			if(mode == MODE_EXPERIMENTAL) {
				// PROVIDE ACTIONABL FEEDBACK SUCH AS POTENTIAL INPUTS
				// "Consider adding a new case or values in the existing cases."
				$(lastColumn).html(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]",minimum_num_prog)
					+ " Provide more examples.");
			} else {
				$(lastColumn).html(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]",minimum_num_prog));
			}
			$(lastColumn).attr("status","warning");
			isEveryStepRight = false;
		} else {  
			console.error("SOMETHING WRONG?");
			isEveryStepRight = false;
		}
	}
	// NOT SHOWING FEEBACK FOR TUTORIAL_1
	if(tid=="tutorial_1") {
		$(taskEl).find("tr.step,tr.output td.lastColumn").text("");
	}	
	return {
		isEveryStepRight:isEveryStepRight,
		numProgList:num_prog_list
	};
}

function generateFailMessage(data, i, tr) {
	// Returns actionable feedback for i-th row that failed to find any program
	var failMessages = [];
	var numSteps = data['steps'].length;
	var dataFlatArr = [data['input']].concat(data['steps']).concat([data['output']]);
	var prevStepData = dataFlatArr.slice(0,i+1);
	var curStepData = (i<numSteps) ? data['steps'][i] : data['output'];
	var curValues = _.map(curStepData, function(v){return str2array(v); });
	// CASE: EMPTY CELL --> IS IT INTENTIONAL?
	if(_.some(curStepData, function(v){ return v.length==0; })){
		failMessages.push("There is an empty case. Did you miss filling it?");
	}
	// CASE: PARSEFLOAT EXCEPTION --> HIGHLIGHT THE CELL IN YELLOW
	var typeConsistency = evaluateTypeConsistencyOfStep(curStepData);
	if(typeConsistency.concistency==false) {
		var strTypes = typeConsistency.types.join(", ");
		failMessages.push("There are "+strTypes+" examples in this case. This might have failed the computer finding a program.");
	} 
	// CASE: CURRENT STEP IS A FILTERED LIST OF ANY STEPS ABOVE -->   
	// 		 CONFIRM & TELL THEM TO GIVE T, F  	
	for (var prevStep of prevStepData){
		var prevValues = _.map(prevStep, function(v){return str2array(v); });
		if (isFiltered2D(prevValues, curValues)) {
			failMessages.push("If you are trying to filter values from steps above, you need an additional step containing T or F.");
			break;			
		} else {  }
	}
	// CASE: CURRENT STEP IS A SUBSTRING OF FILTERED VERSION LIST -->
	// 		 CONFIRM & TELL THEM TO DO TWO TASKS AT THE SAME TIME
	for (var prevStep of prevStepData){
		var prevValues = _.map(prevStep, function(v){return str2array(v); });
		if (isFilteredAndExtracted(prevValues, curValues)) {
			failMessages.push("Are you trying to filter and extract part of string at the same time? If that's the case, you have to do them in two steps.");
			break;			
		} else {  }
	}
	// CASE: CURRENT STEP IS ALL T and F, 
	// 		but previous rows do not have numbers --> 
	// 		T and F can only be calculated from numbers only
	if(_.every(_.flatten(curValues), function(v){ 
		return v.toLowerCase()=="t" || v.toLowerCase()=="f";
	})) {
		var isThereAnyNumberCaseWithSameShape = false;
		for(var prevStep of prevStepData) {
			try{	var prevValues = _.map(prevStep, function(v){return str2array(v, "number"); });	
			} catch(e){   continue;  }
			if(!isSameShape(curValues, prevValues)) continue;
			else { // THERE IS A PREVIOUS STEP THAT HAS THE SAME SHAPE AS THE CURRENT STEP
				// AND CAN BE CONVERETED TO NUMBERS
				isThereAnyNumberCaseWithSameShape = true;
				break;
			}
		}
		if(!isThereAnyNumberCaseWithSameShape){
			failMessages.push("T, F can be calculated from numbers only. Insert a step above, and find suitable numbers that can be calculated to this step.");
		}
	}
	if(failMessages.length==0) failMessages.push("No program is found for this step. Consider adding a step above.");
	var htmlFailMessages = "<ul class='feedback_list'>";
	for(var ifm in failMessages) {
		htmlFailMessages += "<li><i class='fa fa-exclamation-triangle' aria-hidden='true'></i> "+failMessages[ifm]+"</li>";
	} 
	htmlFailMessages += "</ul>";
	return htmlFailMessages;
}


function giveUpTask(tid){
	Log.push({
		event:"GIVE_UP_TASK", 
		tid: tid,
		detail: {
		},
		timestamp:Date.now()
	});	
	Timer[tid]["end_stamp"]=Date.now();
	// // SHOW SOLUTION
	// var testResultEl = $(".task[tid='"+tid+"']").find(".testResult");
	// $(testrresultEl)
	// SIMPLY GIVE UP SHOW NEXT SECTION
	var currentSection = $(".section[tid='"+tid+"']");
	if(tid==task_id_list[task_id_list.length-1]) {
		// IF CURRENt TASK IS THe LAST ONE, THEN SHOW ENDOfTASK DIV
		$("div.endOfTask").removeClass("hidden");
	} else if($(currentSection).hasClass("lastTutorial")) {
		$("div.endOfTutorial").removeClass("hidden");
	} else {
		var taskEl = $("div.section[tid='"+tid+"']");
		openSection($(taskEl).next(".section").attr("tid"));	
		// IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
		if(tid.indexOf("task")!=-1) {	$(taskEl).addClass("hidden");	}
	}
}

/*
	For TUTORIALS, when #trials and time exceed minimum, show hints. 
*/
function showSolution(tid, programs, taskEl) {
	var solution = pbeTasks[tid].solution;
	var table = $("<table class='simple hidden'></table>");
	for(var row of solution) {
		var tr = $("<tr></tr>");
		for(var v of row) {
			$(tr).append("<td>"+v+"</td>");
		}
		$(table).append(tr);
	}
	$(taskEl).find("div.testResult").empty()
	.append("<span class='failResult' style='color:red;'>It seems that you are having trouble. <button class='butShowSolution'>Show solution</button></span>")
	.append(table);
}

function openSection(tid){
	var sectionEl = $("div.section[tid='"+tid+"']");
	if($(sectionEl).hasClass("hidden")) {
		$(sectionEl).removeClass("hidden").css("opacity","0").animate({opacity: 1.0}, 1000);
		Log.push({
			event:"OPEN_SECTION", 
			tid: $(sectionEl).attr("tid"),
			detail: {
			},
			timestamp:Date.now()
		});
	}	
}
function extractDataFromTaskEl(taskEl){
	data={};
	data['input'] = $.map($(taskEl).find("tr.input td:not(.lastColumn)"), function(td){ return $(td).text(); });
    data['steps'] = $.map($(taskEl).find("tr.step"), function(tr){
      return [$.map($(tr).find("td:not(.lastColumn)"), function(td){return $(td).text();})];
    });;
    data['output'] = $.map($(taskEl).find("tr.output td:not(.lastColumn)"), function(td){ return $(td).text(); });	
    return data;
}


// TRIGGERED WHEN PARTICIPANTS CLICK EXAMPLE TABLE
// START COUNTING  
function startTask(tid){
	Timer[tid]={
		start_stamp: Date.now(),
		trials: 0
	};
	Log.push({
		event:"START_TASK", 
		tid: tid,
		detail: {  },
		timestamp:Date.now()
	});
}

