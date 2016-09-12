

pbeTasks = {
	'tutorial_1': {
		'taskID':'tutorial_1',
		'instruction': `Assume that you are teaching computer a program, <code>Input+1</code> that always calculates the output to be one more than the input. <em>Please type 1 in the input and the corresponding output number.  Click "Infer Program" button.</em>`,
		'description':"Input + 1",
		'example':{
			'input':[""],
			'output':[""],
		},
		'features':{
			"addStep":false,
			"addCase":false,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			

			if(inputValues[0]==1 && outputValues[0]==2){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:"Type 1 in Input, and 2 in Output."};
			}
		}
	},
	'tutorial_2': {
		'taskID':'tutorial_2',
		'instruction': `Nice work! However, the computer inferred many programs (e.g. <code>Input*2, Input+1</code>) that also can calculate 2 for 1. You need tell the computer which program is correct by giving additional cases. <em>Click [Add Case] button, and provide another input and a corresponding output number.</em>`,
		'description':"Input + 1",
		'example':{
			'input':["1"],
			'output':["2"],
		},
		'features':{
			"addStep":false,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.map(v, function(vv){ return vv+1; });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},
	'tutorial_3': {
		'taskID':'tutorial_3',
		'instruction': `Keep in mind that every step must have exactly one program only.<br><br>Let&#39;s learn about <em>steps</em>. The computer may not be smart enough to learn programs for complex tasks at once. For instance, the computer cannot learn multi-step calculations such as <code>(Input+1)*2</code>, no matter how many examples of input and output you give. Instead, you should <em>break the task into subtasks, and insert additonal steps</em> containing values that those subtasks calculate. In the example below, you need to click <img width='27px' src='css/image/addStep.png'> to add a step, and type results of the subtask (<code>Input+1</code>).`,
		'description':"(Input + 1) * 2",
		'partialDescription':["Input + 1"],
		'example':{
			'input':["1"],
			'output':["4"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.map(v, function(vv){ return (vv+1)*2; });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},
	'tutorial_3_2': {
		'taskID':'tutorial_3_2',
		'instruction': `To teach <code>(Input+1)*(Input-1)</code>, you need to add two steps for subtasks, <code>Input+1</code> and <code>Input-1</code>. <em>Click <img width='27px' src='css/image/addStep.png'> to add two steps. And type results of two subtasks respectively.</em> Note that <b>ordering of steps does not matter</b>, because the computer automatically figures out dependency between steps.`,
		'description':"(Input + 1) * (Input - 1)",
		'example':{
			'input':["1"],
			'output':["0"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.map(v, function(vv){ return (vv+1)*(vv-1); });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},


	'tutorial_4': {
		'taskID':'tutorial_4',
		'instruction': `In the previous tasks, each case contains single values. However, some tasks should deal with lists of items (separated by ","). In the following task, you teach the computer to sort a list of numbers in ascending order. Note that the default example (1,-1&rarr;-1,1) is <em>not sufficient</em>, because the computer will find 4 programs ((e.g. <code>Sort</code>, <code>Input * -1</code>, <code>Input / -1</code>, and <code>Reverse Input</code>) that all calculate -1,1 for 1,-1. <em>Give another case of sorting numbers</em> so that when you press <em>Teach Computer</em> button, the computer will be able to find a single correct program.`, 
		'description':"Sort numbers in ascending order",
		'example':{
			'input':["1,-1"],
			'output':["-1,1"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return v.sort();
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},
	'tutorial_4_2': {
		'taskID':'tutorial_4_2',
		'instruction': `The computer can <em>sort text</em>. Lets sort it in descending order this time.`, 
		'description':"Sort text in descending order",
		'example':{
			'input':["a,b"],
			'output':["b,a"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return v.sort().reverse();
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},
	'tutorial_5': {
		'taskID':'tutorial_5',
		'instruction': `Teach the computer to perform the following task.`,
		'description':"Get the sum of all numbers.",
		'example':{
			'input':["1,1"],
			'output':["2"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return [sum(v)];
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},
	
	'tutorial_text_extraction': {
		'taskID':'tutorial_text_extraction',
		'instruction': `Many tasks handle text data. Teach the computer to get the length of Input text (including spaces).`,
		'description':"Get length of a text value (including spaces).",
		'example':{
			'input':["yes"],
			'output':["3"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.map(v, function(vv){ return vv.length; });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},

	// 'tutorial_6_2': {
	// 	'taskID':'tutorial_6_2',
	// 	'instruction': `The following program <b>counts alphabetical characters only</b>, which means that it requires an additional step that holds <b>the Input value without numbers and spaces</b>. <span class='stress'>Create an additional step, and provide sufficient  examples for the following program.</span>`,
	// 	'description':"Count alphabetic characters (excluding numbers or spaces) of Input text.",
	// 	'partialDescription':["Input text without numbers or spaces"],
	// 	'example':{
	// 		'input':["a 1b"],
	// 		'output':["2"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		var requiredSteps = 1;
	// 		var requiredCases = 2;
	// 		// 0. PREPARE DATA TYPES 
	// 		var input = data['input'];
	// 		var output = _.map(data['output'], function(v){ return parseFloat(v); });
	// 		var steps = _.map(data['steps'], function(oneStep){	return oneStep; });
	// 		// 0. CHECK # STEPS ANd # CASES
	// 		if(data['steps'].length < requiredSteps) return { isValid:false, message:MESSAGE_INSUFFICIENT_STEPS};
	// 		if(data['input'].length < requiredCases) return { isValid:false, message:MESSAGE_INSUFFICIENT_EXAMPLES};
	// 		// 1. CHECK OUTPUT IS VALID
	// 		var trueOutput = _.map(input, function(caseVal){ return caseVal.replace(/[^a-zA-Z]/g,'').length; }); 
	// 		if (isSameArray(output, trueOutput)==false) return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
	// 		// 2. CHECK STEPS INCLUDE EVERY TRUESTEPS
	// 		var trueStep1 = _.map(input, function(caseVal){ return caseVal.replace(/[^a-zA-Z]/g,''); });
	// 		if (_.some(steps, function(step){ return isSameArray(step, trueStep1); })==false) return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
	// 		// E. IF IT PASSED EVEYR TEST, RETURN TRUE
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },

	
	'tutorial_filter_1': {
		'taskID':'tutorial_filter_1',
		'instruction': `You can teach the computer how to <em>filter items in list</em>. It requires an additional step that contains <em>booleans</em> (<code>true</code> or <code>false</code>). The <code>true</code> value means that the filered list will <em>include</em> the corresponding item. The <code>false</code> means the corresponding item will be excluded. For instance, <code>false, true</code> will filter out the first item. Teach the following task by providing an additional step and more cases.`,
		'description':"Find numbers that are greater than 10",
		'example':{
			'input':["10,9,11"],
			'output':["11"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.filter(v, function(vv){ return vv>=10; });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},

	// 'tutorial_boolean_1': {
	// 	'taskID':'tutorial_boolean_1',
	// 	'instruction': `Complex filtering often require multiple conditions (e.g. finding numbers that are greater than 5 and less than 8). You can teach the computer to combine two boolean lists using AND and OR operators. First, <em>AND</em> operator calculates <code>true</code> only if <em>both booleans are <code>true</code></em>. Second, <em>OR</em> operator calculates <code>true</code> if <em>either boolean is <code>true</code></em>.`,
	// 	'description':"Find numbers that are greater than 5 and less than 8.",
	// 	'example':{
	// 		'input':["2,5,6,7,8,9"],
	// 		'steps':[
	// 			["false,false,true,true,true,true"],
	// 			["true,true,true,true,false,false"]
	// 		],
	// 		'output':["false,false,true,true,false,false"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testOutput':function(data){
	// 		var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
	// 		var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
	// 		var trueOutputValues = _.map(inputValues, function(v){ 
	// 			return _.filter(v, function(vv){ return vv>=10; });
	// 		});
	// 		if(isSameArray(trueOutputValues, outputValues)){
	// 			return { isValid:true, message:MESSAGE_PASS };
	// 		} else {
	// 			return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
	// 		}
	// 	}
	// },

	// 'tutorial_8': {
	// 	'taskID':'tutorial_8',
	// 	'instruction': `Some programs handle <b>list of lists</b>. For example, <span class='value'>[1,2,3],[4,5],[6]</span> represents a list of three lists. Note that inner lists must be surrounded by "[" and "]".
 //    <br><br>
 //    <span class='stress'>Provide another example for the following program.</span>`,
	// 	'description':"Find the largest values from each list of Input",
	// 	'example':{
	// 		'input':["[1,2,3], [4,5], [6]"],
	// 		'output':["3,5,6"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		var requiredSteps = 0;
	// 		var requiredCases = 2;
	// 		// 0. PREPARE DATA TYPES 
	// 		var input = _.filter(_.map(data['input'], function(oneCase){ return JSON.parse("[" + oneCase + "]"); }),function(arr){return arr.length>0; });
	// 		var output = _.map(data['output'], function(oneCase){ return JSON.parse("["+oneCase+"]");});
	// 		var steps = _.map(data['steps'], function(oneStep){	return oneStep; });
	// 		// 0. CHECK # STEPS ANd # CASES
	// 		if(data['steps'].length < requiredSteps) return { isValid:false, message:MESSAGE_INSUFFICIENT_STEPS};
	// 		if(data['input'].length < requiredCases) return { isValid:false, message:MESSAGE_INSUFFICIENT_EXAMPLES};
	// 		// 1. CHECK OUTPUT IS VALID
	// 		var trueOutput = _.map(input, function(caseVal){ return _.map(caseVal, function(v){return _.max(v); }); }); 
	// 		if (isSameArray(output, trueOutput)==false) return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
	// 		// E. IF IT PASSED EVEYR TEST, RETURN TRUE
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },

	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////

	// 난이도 하
	// 사용한다. 
	// 이유는... 앞에서 배운 두가지 text_length와 filter를 합친 것이니까 테스트하기 좋음. 
	'task_filter_words_by_length': {
		'taskID':'task_filter_words_by_length',
		'active': true,
		'instruction': `Teach the computer to perform the following task.`,
		'description':"Find words that are longer than two letters",
		'example':{
			'input':["be, are, I, some"],
			'output':["are, some"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.filter(v, function(vv){ return vv.length>2; });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},

	// 난이도 하
	// 사용한다. 다른 필터와 비슷.
	'task_filter_numbers_by_length': {
		'taskID':'task_filter_words_by_length',
		'active': true,
		'instruction': `Teach the computer to perform the following task.`,
		'description':"Find words that are longer than two letters",
		'example':{
			'input':["be, are, I, some"],
			'output':["are, some"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.filter(v, function(vv){ return vv.length>2; });
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},



	// DONT USE IT
	// THERE ARE TOO MANY WAYS TO SOLVE IT
	// ART AND MATH ARE NOT CLEAR --> MAKING TASK HARD
	// 'task_group_score': {
	// 	'taskID':'task_group_score',
	// 	'instruction': `Input holds scores of two exams (Art and Math). Scores follow <span class='value'>NAME:EXAM:SCORE</span> format (e.g. <span class='value'>Lee:Art:87</span> means that Lee got 87 points in the Art exam). The program must get minimum and maximum scores of two exams separately. For example, <span class='value'>[Art, 87, 64]</span> represents that 87 and 64 are max. and min. scores of Art exam.`,
	// 	'description':"Find minimum and maximum scores of the Art exam.",
	// 	'partialDescription':["Extract course names", "Find scores that contain Art","Get first names"],
	// 	'requiredSteps':2,
	// 	'example':{
	// 		'input':["Jane:Art:87, Jane:Math:47, Tom:Math:59, Tim:Art:64, Lin:Math:99, Lin:Art:72"],
	// 		'output':["87, 64"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },


	// NOT WORTH TO TEST
	// TASK INSTRUCTION IS TOO EASY TO CONVERT TO 2-STEP EXAMPLES
	// 'task_name_conversion': {
	// 	'taskID':'task_name_conversion',
	// 	'instruction': `Input is a list of full names. The program flips the first and last name, and then abbreviates first name. For example, <span class='value'>Jon Anderson &rarr; Anderson J.</span>`,
	// 	'description':"Flip the first and last name, and abbreviate the first name.",
	// 	'partialDescription':["Get last names", "Abbreviate last names", "Get first names"],
	// 	'requiredSteps':3,
	// 	'example':{
	// 		'input':["Jon Anderson, Tim Cook"],
	// 		'output':["Anderson J., Cook T."],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },


	// TOO EASY 
	// 'task_extract': {
	// 	'taskID':'task_extract',
	// 	'instruction': `Input represents second-hand cars that follow <span class='value'>MODEL(YEAR)-MILEAGE-PRICE</span> format (e.g. <span class='value'>Civic(2014)-45000-$12000</span>). The program must find the last two digits of YEAR (14) information of every car.`,
	// 	'description':"Extract the last two digits from years in Input.",
	// 	'partialDescription':["Extract year", "Extract last two digits"],
	// 	'requiredSteps':1,
	// 	'example':{
	// 		'input':["Civic(2014)-45000-$12000, Elantra(2012)-60000-$9500, Corolla(2015)-13000-$14000"],
	// 		'output':["14,12,15"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },


	// TEXT TOO lONG. DIFFICULT TO CREATE CONSISTENT EXAMPLES
	// USERS JUST SORTED TWICE --> TASK IS TOO HARD
	// 'task_sort': {
	// 	'taskID':'task_sort',
	// 	'instruction': `Input represents second-hand cars that follow <span class='value'>MODEL(YEAR)-PRICE</span> format (e.g. <span class='value'>Civic(2014)-$12000</span>).  The program should sort cars by their model and then year in increasing order. See the provided example in the table below. Remember that this program is complex, and might require multiple steps between Input and Output.`,
	// 	'description':"Sort cars by their models in increasing order, and then by years in decreasing order.",
	// 	'partialDescription':["Extract models", "Extract years", "Sort Input by model and year"],
	// 	'requiredSteps':2,
	// 	'example':{
	// 		'input':["Civic(2014)-$12000, Focus(2008)-$9500, Civic(2011)-$12000, Focus(2015)-$14500, BMW X5(2016)-$50000"],
	// 		'output':["BMW X5(2016)-$50000, Civic(2014)-$12000, Civic(2011)-$12000, Focus(2015)-$14500, Focus(2008)-$9500"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },


	// 사용한다.
	// 이건 상당히 좋음. 1. 사람들마다 스텝을 만드는 방식이 다름. 그런데 max, min, sort, filter로 대부분 커버가됨
	'task_find_range': {
		'taskID':'task_find_range',
		'instruction': `Input is a list of lists that hold numbers. Teach the computer to find differences between maximum and minimum values within each list. If a sublist contains less than two numbers, its gap should be 0.`,
		'active':true,
		'description':"Find gaps between minimum and maximum values within each sublist.",
		'partialDescription':["Find maximum values", "Find minimum values", "Calculate gaps"],
		'requiredSteps':2,
		'example':{
			'input':["[6,1,-3]"],
			'output':["9"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(vList){ 
				return _.max(vList) - _.min(vList);
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},

	'task_conditional_replace': {
		'taskID':'task_conditional_replace',
		'instruction': `Input is a list of full names often with titles. For names longer than 10 characters including spaces, the program should abbreviate the middle name (e.g. John Lamar Smith -> John L. Smith). Note that some names may not have middle names.`,
		'description':"Abbreviate the middle name to make it equal or shorter than 10 characters.",
		'partialDescription':["Get lengths of full names", "Find names that are longer than 10 characters", "Abbreviate middle names"],
		'requiredSteps':2,
		'example':{
			'input':["John Lamar Smith, Jon Smith, Kevin Smith"],
			'output':["John L. Smith, Jon Smith, Kevin Smith"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testFunction': function(data){
			return { isValid:true, message:MESSAGE_PASS };
		},
	},




};