/// <reference path="task.ts" />
let Data = {};
let log = new Log("TBD");
let Timer = {};
let Programs = {};
let last_task_tid = undefined;

function skipToTutorial() {
	$(".introduction").addClass("hidden");
	$(".tutorial_container").removeClass("hidden");
	$(".tutorial_container").find("div.section").removeClass("hidden");
}
function skipToTask() {
	$(".introduction").addClass("hidden");
	$(".task_container").removeClass("hidden");
	$(".task_container").find("div.section").removeClass("hidden");
}
function skipToScreening() {
	$(".introduction").addClass("hidden");
	$(".task_container").addClass("hidden");
	$(".tutorial_container").addClass("hidden");
	$(".screening_container").removeClass("hidden");
}


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




function setCaseNum(tr, caseNum) {
	var existingCases = $.makeArray($(tr).find("td"));
	$(tr).find("td").remove();	// CLEAR
	for(var i=0; i<caseNum; i++) {
		if(i < existingCases.length) $(tr).append(existingCases[i]);
		else {
			$(tr).append("<td><input></td>");
		}
	}
	return tr;
}

function sendLog(data) {
	$.get("log",{
		data:data,
		workerID: workerID
	}, function(result){
		// CALLBACK FOR LOGGING
	});
}

function submit() {
	var data = {};
	// DEMOGRAPHIC QUESTIONS
	data['demography'] = {};
	data['demography']['q_age'] = $(".screening_container").find("input[name='age']:checked").val();
	data['demography']['q_gender'] = $(".screening_container").find("input[name='gender']:checked").val();
	data['demography']['q_gender_other'] = $(".screening_container").find("input#q_gender_other").val();
	data['demography']['q_education'] = $(".screening_container").find("input[name='education']:checked").val();
	data['demography']['q_major'] = $(".screening_container").find("input#q_major").val();
	data['demography']['q_occupation'] = $(".screening_container").find("input#q_occupation").val();
	data['demography']['q_prog_exp'] = $(".screening_container").find("input[name='prog_exp']:checked").val();
	data['demography']['q_computer_exp'] = [];
	for(var i=1;i<=5;i++) {
		data['demography']['q_computer_exp'].push($(".screening_container")
			.find("input[name='computer_exp_"+i+"']").prop('checked'));
	}
	data['programs'] = Programs;
	data['mode'] = mode;
	data['mode'] = mode;
	// LOG DATA
	data['log'] = Log;
	console.log(data);
	submit_worker(data);
}
function submit_worker(data) {
	$.post("submit",{
		data:JSON.stringify(data),
		workerID: workerID
	}, function(result){
		console.log("submitted");
	});
}

window.onerror = function reportUncaughtErrors(errorMsg, url, lineNumber) {
    sendLog(errorMsg);
    return false;
}

$(document).ready(function() {
	// POPULATING TUTORIAL TASKS
	generateAllTutorials();
	generateAllTasks(mode);
	
	// KEYBOARD EVENT
	$("table.inAndOut").on("keydown", "td:not(.lastColumn)", function(e,ui){
		if(e.keyCode == 9) { // TAB
			var colNum = $(e.target).parents("tr").find("td").index(e.target);
			var nextRow = $(e.target).parents("tr").next("tr");
			if(nextRow.length == 0) {
				nextRow = $(e.target).parents("table").find("tr").first();
				if($(nextRow).find("td").length>colNum)
					colNum++;
			}
			$(nextRow).find("td").get(colNum).focus();
			// e.preventDefault();
			return false;
		}

	});


});


window.onbeforeunload = function() { return "Watch out! The entire work on this survey will be lost."; };


