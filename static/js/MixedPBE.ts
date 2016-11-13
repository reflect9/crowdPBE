class MixedPBE {
    public log = new Log("TBD");
    public last_task_tid: string = undefined;
    public mode: string = "{{mode}}";
    public workerID: string = "{{workerID}}";

    public taskModels: TaskModel[] = [];
    public taskViews: TaskView[] = [];
    public taskControllers: TaskController[] = [];

    public crowdPlanner: CrowdPlanner = new CrowdPlanner();

	constructor() {
		for(let tid of TaskDefinition.getAllIDs()) {
            // PREPARE ELEMENT THAT WILL CONTAIN TASK 
            let $section = $("<div class='section hidden' tid='"+tid+"'></div>");
            if(tid.indexOf("tutorial") != -1) {
                $section.insertBefore($("div.tutorial_container div.endOfTutorial"));
            } else {
                $section.insertBefore($("div.task_container div.endOfTask"));
            }
            // CREATING TASKMODEL and VIEW
			let model = new TaskModel(TaskDefinition.getTaskDefinition(tid), this);
			let view = new TaskView($section);
			let controller = new TaskController(tid, this);
			controller.connectAll(model, view);
			// ADD MVC TO THE LIST
			this.taskModels.push(model);
			this.taskViews.push(view);
			this.taskControllers.push(controller);
			// RENDER TASK
			view.renderTask();
        }

		// ATTACH ALL KEYBOARD EVENTS
		this.attachKeyboardEventHandler();
	}

    ///// DEBUGGING FUNCTIONS
    public skipToTutorial() {
        $(".introduction").addClass("hidden");
        $(".tutorial_container").removeClass("hidden");
        $(".tutorial_container").find("div.section").removeClass("hidden");
    }
    public skipToTask() {
        $(".introduction").addClass("hidden");
        $(".task_container").removeClass("hidden");
        $(".task_container").find("div.section").removeClass("hidden");
    }
    public skipToScreening() {
        $(".introduction").addClass("hidden");
        $(".task_container").addClass("hidden");
        $(".tutorial_container").addClass("hidden");
        $(".screening_container").removeClass("hidden");
    }


    /////// SUBMITTING DATA TO THE SERVER
    public submit(): void {
        let data = {};
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
        for(let i=1;i<=5;i++) {
            data['demography']['q_computer_exp'].push($(".screening_container")
                .find("input[name='computer_exp_"+i+"']").prop('checked'));
        }
        data['tasks'] = _.map(this.taskModels, function(m){ return m.getReport(); });
        data['mode'] = this.mode;
        console.log(data);
        this.submit_worker(data);
    }
    private submit_worker(data): void {
        let xmlhttp: XMLHttpRequest;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                // CALLBACK HERE
            }
        }
        xmlhttp.open("POST", "submit", true);
        xmlhttp.send({
            data: JSON.stringify(data),
            workerID: this.workerID
        });
    }

	private attachKeyboardEventHandler(): void {
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
	}
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

$(document).ready(function() {
	let mixedPBE = new MixedPBE();	
});


window.onbeforeunload = function() { return "Watch out! The entire work on this survey will be lost."; };



const MESSAGE_STEP_FAIL:string = `<i class='fa fa-ban' aria-hidden='true'></i>
                    Found no program that calculates this step for one of the above steps.`;
const MESSAGE_STEP_WARNING:string = `<i class='fa fa-exclamation-circle' aria-hidden='true'></i>
                    Found [minimum_num_prog] programs that calculate this step.`;
const MESSAGE_STEP_SUCCESS:string = `<i class='fa fa-check-circle' aria-hidden='true'></i>
                    Found a single program that calcuates the step.`;
const MESSAGE_AMBIGUOUS_STEPS:string = "<i class='fa fa-ban' aria-hidden='true'></i> For at least one step, the computer found no program or multiple programs. Try to teach a single program for each step.";
const MESSAGE_PASS:string = "<i class='fa fa-check-circle' aria-hidden='true'></i>The computer learned the correct program.";
const MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM:string = "<i class='fa fa-ban' aria-hidden='true'></i> An inconsistent set of programs was returned for the different examples provided.";
const REQUIRED_MINUTES:number = 3;
const REQUIRED_TRIALS:number = 8;;

const MODE_FIXED = "fixed";
const MODE_MIXED_TRIAL = "mixed_trial";
const MODE_MIXED_TASK = "mixed_task";
const MODE_MIXED_ALL = "mixed_all";


