Data = {};
HandsonTableObjects = [];
Log = [];
Timer = {};
Programs = {};


function skipToTutorial() {
	$(".introduction").addClass("hidden");
	$(".tutorial_container").removeClass("hidden");
	$(".tutorial_container").find("div.section").removeClass("hidden");
}
function skipToTask() {
	$(".introduction").addClass("hidden");
	$(".task_container").removeClass("hidden");
	// $(".task_container").find("div.section").removeClass("hidden");
}
function skipToScreening() {
	$(".introduction").addClass("hidden");
	$(".task_container").addClass("hidden");
	$(".tutorial_container").addClass("hidden");
	$(".screening_container").removeClass("hidden");
}


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

function submit() {
	var data = {};
	// EMAIL
	data['email'] = $("input#email").val();
	// DEMOGRAPHIC QUESTIONS
	data['q_age'] = $(".screening_container").find("input[name='age']:checked").val();
	data['q_gender'] = $(".screening_container").find("input[name='gender']:checked").val();
	data['q_gender_other'] = $(".screening_container").find("input#q_gender_other").val();
	data['q_occupation'] = $(".screening_container").find("input#q_occupation").val();
	data['q_prog_exp'] = $(".screening_container").find("input[name='prog_exp']:checked").val();
	data['q_prog_exp_other'] = $(".screening_container").find("input#q_prog_exp_other").val();
	data['q_computer_exp'] = [];
	for(var i=1;i<=7;i++) {
		data['q_computer_exp'].push($(".screening_container")
			.find("input[name='computer_exp_"+i+"']").prop('checked'));
	}
	// TASK DATA
	data['tasks'] = [];
	$("div.section").each(function(i,sectionEl) {
		var taskEl = $(sectionEl).find("div.task");
	    var taskData = {};
	    taskData['tid']= $(taskEl).attr('tid');
	    taskData['input'] = $.map($(taskEl).find("tr.input td:not(.lastColumn)"), function(td){ return $(td).text(); });
	    // taskData['steps_desc'] = $.map($(taskEl).find("tr.step"), function(tr){
	    // 	return $(tr).find("input.stepDesc").val();
	    // });
	    taskData['steps'] = $.map($(taskEl).find("tr.step"), function(tr){
	      return [$.map($(tr).find("td"), function(td){return $(td).text();})];
	    });
	    taskData['output'] = $.map($(taskEl).find("tr.output td"), function(td){ return $(td).text(); });
		data['tasks'].push(taskData);
	});
	// LOG DATA
	data['log'] = Log;
	console.log(data);
	$.post("submit",{data:JSON.stringify(data)}, function(result){
		console.log("submitted");
	});
}

$(document).ready(function() {
	// POPULATING TUTORIAL TASKS
	$("div.tutorial_container div.section").each(function(i, sectionEl) {
		var tutorialID = $(sectionEl).attr("tid");
		if(tutorialID) {
			generateSingleTask(tutorialID, sectionEl);	
		}
	});
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


	// INITIALIZE HANDSONTABLES FOR TD THAT NEEDS SPREADSHEET FOR STRUCTURED DATA
	// $("td.handsontableTD").each(function(i, td) {
	// 	var inputData = JSON.parse($(td).text());
	// 	var colHeaders = (inputData['colHeader']) ? (inputData['colHeader']): false;
	// 	$(td).empty();
	// 	var handsonEl = $("<div class='ht_el'></div>").appendTo(td);
	// 	var htObj = new Handsontable(handsonEl.get(0), {
	// 		data: inputData['data'],
	// 		rowHeaders: false,
	// 		colHeaders: colHeaders,
	// 		autoColumnSize: {syncLimit:150},
	// 	});
	// 	HandsonTableObjects.push(htObj);
	// });
	// new Handsontable($(".httest").get(0), {
	// 	data: [[2,3,4,5]],
	// 	colHeaders: false,
	// 	rowHeaders: false,
	// });


});


window.onbeforeunload = function() { return "Watch out! The entire work on this survey will be lost."; };


