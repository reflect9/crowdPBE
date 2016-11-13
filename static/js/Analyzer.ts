/// <reference path="references.ts" />

class Analyzer_MixedTrial {
	public static analyzeFailure(trial: Trial, i: number) {
		// Returns actionable feedback for i-th row that failed to find any program
		let failMessages = [];
		let failCode = [];
		var dataFlatArr = trial.getFlatArray();
		var prevStepData = dataFlatArr.slice(0,i+1);
		var curStepData = (i<trial.getStepNum()) ? trial.steps[i] : trial.output;
		var curValues = _.map(curStepData, function(v){return str2array(v); });
		var prevValues: any[][];
		// CASE: EMPTY CELL --> IS IT INTENTIONAL?
		if(_.some(curStepData, function(v){ return v.length==0; })){
			failMessages.push("There is an empty case. Did you miss filling it?");
			failCode.push("EMPTY_CELL");
		}
		// CASE: PARSEFLOAT EXCEPTION --> HIGHLIGHT THE CELL IN YELLOW
		var typeConsistency = evaluateTypeConsistencyOfStep(curStepData);
		if(typeConsistency.consistency==false) {
			var strTypes = typeConsistency.type.toString();
			failMessages.push("There are "+strTypes+" examples in this case. This might have failed the computer finding a program.");
			failCode.push("INCONSISTENT_TYPE_["+typeConsistency.type.toString()+"]");
		} 
		// CASE: CURRENT STEP IS A FILTERED LIST OF ANY STEPS ABOVE -->   
		// 		 CONFIRM & TELL THEM TO GIVE T, F  	
		for (var prevStep of prevStepData){
			prevValues = _.map(prevStep, function(v){return str2array(v); });
			if (isFiltered2D(prevValues, curValues)) {
				failMessages.push("If you are trying to filter values from steps above, you need an additional step containing T or F.");
				failCode.push("FILTER_WITHOUT_TF");
				break;			
			} else {  }
		}
		// CASE: CURRENT STEP IS A SUBSTRING OF FILTERED VERSION LIST -->
		// 		 CONFIRM & TELL THEM TO DO TWO TASKS AT THE SAME TIME
		for (var prevStep of prevStepData){
			prevValues = _.map(prevStep, function(v){return str2array(v); });
			if (isFilteredAndExtracted(prevValues, curValues)) {
				failMessages.push("Are you trying to filter and extract part of string at the same time? If that's the case, you have to do them in two steps.");
				failCode.push("FILTER_AND_EXTRACT");
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
				try{	
					prevValues = _.map(prevStep, function(v){return str2arrayNumber(v); });	
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
				failCode.push("TF_WITHOUT_NUMBER");
			}
		}
		if(failMessages.length==0) {
			failMessages.push("No program is found for this step. Consider adding a step above.");
			failCode.push("NO_PROGRAM_FOUND");
		}
		var htmlFailMessages = "<ul class='feedback_list'>";
		for(var ifm in failMessages) {
			htmlFailMessages += "<li><i class='fa fa-exclamation-triangle' aria-hidden='true'></i> "+failMessages[ifm]+"</li>";
		} 
		htmlFailMessages += "</ul>";
		var analysis = {
			html: htmlFailMessages,
			failCode: failCode  
		};
		return analysis;
	}

}