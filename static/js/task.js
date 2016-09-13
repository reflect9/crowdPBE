// task_id_list = _.shuffle(["task_group_score","task_extract","task_sort","task_reduce","task_conditional_replace"]);
task_id_list = _.filter(_.keys(pbeTasks), function(k){return k.indexOf("task")!=-1; });
MESSAGE_INSUFFICIENT_EXAMPLES = "Insufficient examples. You can provide more cases or elaborate current examples. ";
MESSAGE_INSUFFICIENT_STEPS = "Failed to find a program matching with the examples. It might need more steps?";
// FEEDBACK FOR INDIVIDUAL STEPS
MESSAGE_STEP_FAIL = "Failed to infer any program that calculates this step from above steps. Make sure the values have no typo, and consider inserting more steps.";
MESSAGE_STEP_WARNING = "Found [minimum_num_prog] programs that calculate this step from the above steps.";
MESSAGE_STEP_SUCCESS = "Found a single program that calcuates the step.";
// FEEDBACK FOR ALL STEPS
MESSAGE_AMBIGUOUS_STEPS = "An inconsistent set of programs was returned for the different examples provided.";
MESSAGE_EXCEPTION = "Unexpected error. Make sure values have no typo.";
// TESTING PROGRAM
MESSAGE_PASS = "Good job! The computer learned the correct program.";
MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM = "The computer learned a wrong program.";
//
REQUIRED_MINUTES = 0;
REQUIRED_TRIALS = 5;
var generateAllTasks = function() {
	var taskContainerEl = $("div.task_container");
	// var task_id_list = _.shuffle(["task_filter","task_extract","task_sort","task_reduce","task_conditional_replace"]);
	$("span#numTasks").text(task_id_list.length);
	_.each(task_id_list, function(tid, index){
		var sectionEl = $("<div class='section hidden' tid='"+tid+"'></div>").appendTo(taskContainerEl);
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
							<button class='testProgram'>Teach Computer</button>\
							<div class='testResult'></div>\
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
		var nextSectionTID = $(currentSection).next(".section").attr("tid");
		openSection(nextSectionTID);
		// IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
		$(currentSection).addClass("hidden");
	});

	// EVENTHANDLER OF STARTING TASK
	$(taskEl).on("click.dd", "", function() {
		var tid = $(this).attr("tid"); 
		$(this).off("click.dd");
		startTask(tid);
	});
	////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	// ADD BUTTON FOR 
	if(tData['features']['addStep']) $(taskEl).find("tr.input th").append("<div class='addStep'>+</div>");
	// EVENTHANDLER FOR ADDING STEP
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
	// EVENTHANDLER FOR REMOVING STEP
	$(taskEl).on("click",".removeStep", function(event){
		$(event.target).parents("tr.step").remove();
	});
	////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////
	// EVENTHANDLER FOR ADDING CASE
	$(taskEl).on("click",".addCase", function(event){
		var buttonEl = event.target;
		var tableEl = $(buttonEl).parents("table.inAndOut");
		$(tableEl).find("tr.input > td.lastColumn").before("<td contenteditable='True'></td>");
		$(tableEl).find("tr.step > td.lastColumn").before("<td contenteditable='True'></td>");
		$(tableEl).find("tr.output > td.lastColumn").before("<td contenteditable='True'></td>");
		$("<td><div class='removeCase hidden'>&#10005;</div></td>").insertBefore($(tableEl).find("tr.lastRow td:last"));
	});
	// EVENTHANDLER FOR REMOVING CASE
	$(taskEl).on("click",".removeCase", function(event){
		var currentNumCases = $(event.target).parents("tr").find("td:not(.lastColumn)").length;
		if(currentNumCases>1) {
			var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index($(event.target).parents("td"));
			$(event.target).parents("table.inAndOut").find("tr").find("td:nth("+id+")").remove();	
		}	
	});
	// EVENTHANDLER FOR SHOWING / HIDING REMOVE CASE BUTTON
	$(taskEl).on('mouseenter',"td:not(.lastColumn)",function(event){
		var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
		$(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
		$(event.target).parents("table.inAndOut").find("tr.lastRow td:nth("+id+") div.removeCase").removeClass("hidden");
	});
	$(taskEl).on('mouseleave',"td:not(.lastColumn)",function(event){
		var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
		$(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
		// $(event.target).parents("table.inAndOut").find("tr.lastRow td").get(id).removeClass("hidden");
	});
	// INFER PROGRAM BUTTON
	$(taskEl).find("button.testProgram").click(function(event, ui){
		var taskEl = $(event.target).parents("div.task");
		var tid = $(taskEl).attr("tid");
		// PREPARING DATA
		var data = extractDataFromTaskEl(taskEl);
		Data[tid] = data;
		// GENERATING PROGRAMS FOR INDIVIDUAL STEPS
		programs = generatePrograms(data);
		var isEveryStepRight = validateProgramsAndShowFeedback(programs, taskEl);
		// LOG
		Log.push({
	    	event:"INFER_PROGRAM",
	    	summary:"INFER_PROGRAM, "+$(taskEl).attr('tid'),
	    	tid:$(taskEl).attr('tid'),
	    	detail:{
	    		data:data,
	    		programs:programs,
	    		result:isEveryStepRight
	    	},
	    	time:Date.now()
	    });
	    Programs[tid] = programs;
		// SHOWING FEEDBACK 
		if(tid=="tutorial_1")  { var isEveryStepRight=true; }
		// SHOW TEST PROGRAM PANEL IF EVERYSTEP IS RIGHT
		if(isEveryStepRight){
			// TESTING DATA (INPUT AND OTUPUT ONLY)
			var testResult = pbeTasks[tid]["testOutput"](Data[tid]);
			if(testResult.isValid == true) {
				$(taskEl).find(".testResult").html("<span style='color:green;'>"+testResult.message+"</span>");
		      	endTask(tid);
		      	if(tid.indexOf("task")!=-1) {	
		      		// IF IT IS REAL TASK, SHOW THE BUTTON TO MOVE ON
					$(taskEl).parents("div.section").find(".openNextSection").removeClass("hidden");	
				} else {
					// IF IT IS TUTORIAL, AUTOMATICALLY MOVE ON
					openSection($("div.section[tid='"+tid+"']").next(".section").attr("tid"));
				}
			} else {
		      $(taskEl).find(".testResult").html("<span style='color:red;'>"+testResult.message+"</span>");;
		    }
			Log.push({
		    	event:"TEST_PROGRAM",
		    	summary:"TEST_PROGRAM, "+tid,
		    	tid:tid,
		    	detail:{
		    		testResult: testResult
		    	},
		    	time:Date.now()
		    });
		} else {
			$(taskEl).find(".testResult").html("<span style='color:red;'>"+MESSAGE_AMBIGUOUS_STEPS+"</span>");
		}//
		// IF PARTICIPANTS SPENT TOO MUCH TIME AND INFERENCE TRIALS, LET HIM GIVE UP 
	    if(isEveryStepRight == false && Timer[tid]) {
	    	// UNSUCCESSFUL TRIAL
	    	var minutesSpent = (Date.now()- Timer[tid]['start_stamp'])/60000;
	    	if(Timer[tid]['trials']>REQUIRED_TRIALS && minutesSpent>REQUIRED_MINUTES) {
	    		$(taskEl).find(".giveup").removeClass("hidden");
	    	}
	    	Timer[tid]['trials'] += 1;
	    } else {
	    	// ALREADY PASSED THIS TASK
	    }
	});
	// GIVEUP
	$(taskEl).find("button.giveup_button").click(function(){
		giveUpTask($(event.target).parents("div.task").attr("tid"));
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
function validateProgramsAndShowFeedback(programs, taskEl){
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
		// 2. FIND PROGRAMS FROM THE INPUT WITH SMALLEST AMBIGUITY
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
	for(var i in num_prog_list){
		var minimum_num_prog = num_prog_list[i];
		var tr = (i<num_prog_list.length-1)? $(taskEl).find("tr.step").get(i): $(taskEl).find("tr.output").get(0);
		var lastColumn = $(tr).find("td.lastColumn");
		$(lastColumn).attr("numPrograms",minimum_num_prog);
		if(minimum_num_prog==0) {  // NO PROGRAM IS GENERATED FOR THE STEP
			$(lastColumn).attr("status","fail");
			$(lastColumn).text(MESSAGE_STEP_FAIL);
			isEveryStepRight = false;
		} else if(minimum_num_prog==1) { // BEST CASE.  CREATED ONE PRGRAM
			$(lastColumn).attr("status","success");
			$(lastColumn).text(MESSAGE_STEP_SUCCESS);
		} else if(minimum_num_prog>1) { // INSUFFICIENT EXAMPLE. CREATED MULTIPLE PROGRAMS.
			$(lastColumn).attr("status","warning");
			$(lastColumn).text(MESSAGE_STEP_WARNING.replace("[minimum_num_prog]",minimum_num_prog));
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
	return isEveryStepRight;
}

function giveUpTask(tid){
	Log.push({
		event:"GIVE_UP_TASK", 
		summary:"GIVE_UP_TASK, "+tid,
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
	var taskEl = $("div.section[tid='"+tid+"']");
	openSection($(taskEl).next(".section").attr("tid"));
	// IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
	if(tid.indexOf("task")!=-1) {	$(taskEl).addClass("hidden");	}
}
function endTask(tid){
	Log.push({
		event:"END_TASK", 
		summary:"END_TASK, "+tid,
		tid: tid,
		detail: {
		},
		timestamp:Date.now()
	});	
}
function openSection(tid){
	var sectionEl = $("div.section[tid='"+tid+"']");
	if($(sectionEl).hasClass("hidden")) {
		$(sectionEl).removeClass("hidden").css("opacity","0").animate({opacity: 1.0}, 1000);
		if(tid.indexOf("tutorial")!=-1) {
			// ANIMATE FOr TUTORIALS
			// $("html, body").delay(500).animate({ scrollTop:"99999px"}, 300);  	
		} else {
			// DONT ANIMATE FOR ACTUAL TASKS
			// $("html, body").delay(500).animate({ scrollTop:"0px"}, 300);  	
		}
		Log.push({
			event:"OPEN_SECTION", 
			summary:"OPEN_SECTION, "+$(sectionEl).attr("tid"),
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
		summary:"START_TASK:" + tid,
		tid: tid,
		detail: {  },
		timestamp:Date.now()
	});
}

