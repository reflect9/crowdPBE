class TaskView {    
	public $target: JQuery;
	public model: TaskModel;
	public controller: TaskController;
	public mpbe: MixedPBE;
	constructor ($target: JQuery) {	
		this.$target = $target;
	}
	
	
	// EXTRACTING TRIAL FROM THE VIEW
	public extractTrial(): Trial {
		let trial: Trial = new Trial();
		trial.input = $.map(this.$target.find("tr.input td:not(.lastColumn)"), function(td){ return $(td).text(); });
		trial.steps = $.map(this.$target.find("tr.step"), function(tr){
			return [$.map($(tr).find("td:not(.lastColumn)"), function(td){return $(td).text();})];
		});;
		trial.output = $.map(this.$target.find("tr.output td:not(.lastColumn)"), function(td){ return $(td).text(); });	
		return trial;
	}

	// RENDER FEEDBACK FOR EVERY STEP
	public renderFeedback(feedbackList: string[]) {
		this.$target.find("tr.step td.lastColumn").each(function (i, column){
			$(column).html(feedbackList[i]);
		});
		this.$target.find("tr.output td.lastColumn").html(_.last(feedbackList));
	}

	// RENDERS HTML OF THE TASK MODEL
	public renderTask() {
		// RENDER SINGLE TASK MODEL IN THE $target
		let tDef = this.model.attr;
		let instructionEl = $("<div class='instruction'></div>").html(tDef.instruction);
		$(instructionEl).appendTo(this.$target);
		// CREATING INNER CONTENT OF DIV.TASK
		let $taskEl = $("<div class='task' tid='"+tDef.taskID+"'>\
						<div class='program'>\
							<div class='header'>TASK <span class='t_desc'>"+tDef.taskID+"</span></div>\
							<div class='description'>"+tDef.description+"</div>\
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
					</div>").appendTo(this.$target);
		// CREATE INITIAL INPUT AND OUTPUT DATA
		for(var i=0;i<tDef.example.input.length;i++) {
			$taskEl.find("tr.input").append("<td contenteditable='true'>"+tDef.example.input[i]+"</td>");
		}
		for(var i=0;i<tDef.example.output.length;i++) {
			$taskEl.find("tr.output").append("<td contenteditable='true'>"+tDef.example.output[i]+"</td>");
			$taskEl.find("tr.lastRow").append("<td><div class='removeCase hidden'>&#10005;</div></td>");
		}
		if(tDef.example.steps) {
			for(var i=0;i<tDef.example.steps.length;i++) {
				let stepData = tDef.example.steps[i];
				let stepEl = $("<tr class='step'><th><div class='removeStep'>&#9988;</div>Step<div class='addStep'>+</div></th></tr>");
				for(let j=0;j<stepData.length;j++) {
					$(stepEl).append("<td contenteditable='True'>"+stepData[j]+"</td>");
				}
				$(stepEl).append("<td class='lastColumn'></td>");
				$(stepEl).insertBefore($taskEl.find("tr.output"));
			}	
		}
		
		// BUTTON FOR ADDING CASE
		if(tDef.addCase) $taskEl.find("tr.input").append("<td class='lastColumn' rowspan=0><button class='addCase'>Add Case</button></td>");
		// PLACES TO SHOW INFERENCE FEEDBACK FOR FOR THE OUTpUT
		$taskEl.find("tr.output").append("<td class='lastColumn' rowspan=0></td>");	

		// EVENTHANDER FOR OPENNEXTSECTION
		$taskEl.find("button.openNextSection").click(function(){
			var currentSection = $(this).parents(".section");
			var tid = $(currentSection).attr("tid");
			if(tid == _.last(TaskDefinition.getAllTaskIDs())) { // IF CURRENt TASK IS THe LAST ONE, THEN SHOW ENDOfTASK DIV
				// TBD: THIS SHOULD BE MOVED TO CONTROLLER
				$("div.endOfTask").removeClass("hidden");
			} else {
				var nextSectionTID = $(currentSection).next(".section").attr("tid");
				// TBD: THIS SHOULD BE MOVED TO CONTROLLER
				this.openSection(nextSectionTID);
				// IF IT IS ACTUAL TASKS, HIDE CURRENT TASKEL
				$(currentSection).addClass("hidden");
			}
		});

		// EVENTHANDLER FOR SHOWING SOLUTION
		$taskEl.on("click","button.butShowSolution",function(event) {
			$(event.target).parents("div.testResult").find("table.simple").removeClass("hidden");
			$(event.target).parents("div.testResult").find("span.failResult").text("Here is one possible solution.");
			$(event.target).addClass("hidden");
			// TBD: HOW DO WE REMEMBER THAT THE USER SAW THE SOLUTION
		})

		// EVENTHANDLER OF STARTING TASK: IF USER CLICKS ANYTHING IN THE TABLE, THE TIMER STARTS
		$taskEl.on("click.dd", "", function() {
			var tid = $(this).attr("tid"); 
			$(this).off("click.dd");
			this.controller.startTask(tid);
		});
		////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////
		// STEP ADD / REMOVE
		if(tDef['features']['addStep']) $taskEl.find("tr.input th").append("<div class='addStep'>+</div>");
		$taskEl.on("click",".addStep", function(event){
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
		$taskEl.on("click",".removeStep", function(event){
			$(event.target).parents("tr.step").remove();
		});
		////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////
		// CASE ADD/REMOVE
		$taskEl.on("click",".addCase", function(event){
			var buttonEl = event.target;
			var tableEl = $(buttonEl).parents("table.inAndOut");
			$(tableEl).find("tr.input > td.lastColumn").before("<td contenteditable='True'></td>");
			$(tableEl).find("tr.step > td.lastColumn").before("<td contenteditable='True'></td>");
			$(tableEl).find("tr.output > td.lastColumn").before("<td contenteditable='True'></td>");
			$("<td><div class='removeCase hidden'>&#10005;</div></td>").insertBefore($(tableEl).find("tr.lastRow td:last"));
		});
		$taskEl.on("click",".removeCase", function(event){
			var currentNumCases = $(event.target).parents("tr").find("td:not(.lastColumn)").length;
			if(currentNumCases>1) {
				var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index($(event.target).parents("td"));
				$(event.target).parents("table.inAndOut").find("tr").find("td:nth("+id+")").remove();	
			}	
		});
		///// MOUSE HOVERING
		$taskEl.on('mouseenter',"td:not(.lastColumn)",function(event){
			var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
			$(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
			$(event.target).parents("table.inAndOut").find("tr.lastRow td:nth("+id+") div.removeCase").removeClass("hidden");
		});
		$taskEl.on('mouseleave',"td:not(.lastColumn)",function(event){
			var id = $(event.target).parents("tr").find("td:not(.lastColumn)").index(event.target);
			$(event.target).parents("table.inAndOut").find("tr.lastRow td div.removeCase").addClass("hidden");
		});
		////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////
		// TEACH COMPUTER BUTTON
		$taskEl.find("button.teachButton").click(   (event, ui) => {
			var taskEl = $(event.target).parents("div.task");
			var tid = $taskEl.attr("tid");
			

		});
		// GIVEUP
		$taskEl.find("button.giveup_button").click( () => {
			$(this).off("click");
			this.controller.giveUp();
		});


	};

	// RENDERS PROGRAM TEST RESULT
	public renderProgramTestResult(message) {
		this.$target.find(".testResult").html(message);
	}

	// SHOW THE HIDDEN BUTTON FOR OPENING NEXT SECTION
	public showButtonForNextSection() {
		this.$target.parents("div.section").find(".openNextSection").removeClass("hidden");
	}

	// RENDERS SOLUTION  
	public renderSolution() {
		var solution = this.model.attr.solution;
		var table = $("<table class='simple hidden'></table>");
		for(var row of solution) {
			var tr = $("<tr></tr>");
			for(var v of row) {
				$(tr).append("<td>"+v+"</td>");
			}
			$(table).append(tr);
		}
		this.$target.find("div.testResult").empty()
		.append("<span class='failResult' style='color:red;'>It seems that you are having trouble. <button class='butShowSolution'>Show solution</button></span>")
		.append(table);
		this.mpbe.log.add(new LogItem("SHOW_SOLUTION", this.controller.taskID, {}));
	}

	// RENDERS GIVEUP MESSAGE  
	public renderGiveUp() {
		this.$target.find(".giveup").removeClass("hidden");
	}

}





