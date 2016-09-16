

pbeTasks = {
	'tutorial_1': {
		'taskID':'tutorial_1',
		'instruction': `Assume that you are teaching the computer a program that always calculates the output to be one more than the input. <em>Please type 1 in the input and the corresponding output number.  Click "Teach Computer" button.</em>`,
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
			try {
				var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
				var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });	
				if(inputValues[0]==1 && outputValues[0]==2){
					return { isValid:true, message:MESSAGE_PASS };
				} else {
					return { isValid:false, message:"Type 1 in Input, and 2 in Output."};
				}
			} catch(e) {
				return { isValid:false, message:"Type 1 in Input, and 2 in Output."};
			}
		}
	},
	'tutorial_arith_1': {
		'taskID':'tutorial_arith_1',
		'instruction': `Nice work! However, other programs such as <code>Input*2</code> also calculate 2 for 1. You need to clarify which program is correct by giving additional cases. <em>Click [Add Case] button, and provide another input and a corresponding output number.</em>`,
		'description':"Input + 1",
		'example':{
			'input':["1"],
			'output':["2"],
		},
		'features':{
			"addStep":false,
			"addCase":true,
		},
		'solution':[
			["Input", 1, 2],
			["Output", 2, 3]
		],
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
	'tutorial_arith_2': {
		'taskID':'tutorial_arith_2',
		'instruction': `Keep in mind that every step must have one program only.<br><br>Let&#39;s learn about <em>steps</em>. The computer may not be smart enough to learn programs for complex tasks in a single step, so we ask you to break the calculation down into simple steps for the computer. For instance, the computer cannot learn multi-step calculations such as <code>(Input+1)*2</code>, no matter how many cases of input and output you give. Instead, you should <em>break the task into subtasks, and insert additonal steps</em> containing the results of each subtask. In the example below, you need to click <img width='27px' src='css/image/addStep.png'> to insert a step, and type results of the subtask (<code>Input+1</code>).`,
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
		'solution':[
			["Input", 1, 2],
			["Step: Input + 1", 2, 3],
			["Output", 4, 6]
		],
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
	
	'tutorial_sum': {
		'taskID':'tutorial_sum',
		'instruction': `In the previous tasks, each case contains single values. However, some tasks should deal with lists of items (separated by ","). Teach the computer to get sum of all numbers in Input.`,
		'description':"Get the sum of all numbers.",
		'example':{
			'input':["1,1"],
			'output':["2"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'solution':[
			["Input", "1,1", "5,3"],
			["Output", "2", "8"]
		],
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
		'instruction': `You can teach programs that handle single-line text.`,
		'description':"Get length of a text value (including spaces).",
		'example':{
			'input':["yes"],
			'output':[""],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'solution':[
			["Input", "yes", "feeling tired"],
			["Output", "3", "13"]
		],
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
	
	'tutorial_filter_1': {
		'taskID':'tutorial_filter_1',
		'instruction': `You can teach the computer how to <em>filter items in list</em>. To do so, you need an additional step with a description of which item should be kept by providing a list of True and False indicators (<code>T</code> or <code>F</code>). The <code>T</code> value means that the filered list will <em>include</em> the corresponding item. The <code>F</code> means the corresponding item will be excluded. For instance, <code>F, T</code> will filter out the first item. Teach the following task by providing an additional step and more cases.`,
		'description':"Find numbers that are greater than 9",
		'example':{
			'input':["11,8,9,10"],
			'output':["11,10"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'solution':[
			["Input", "11,8,9,10"],
			["Step: 'T' for values greater than 9, 'F' for the rest", "T,F,F,T"],
			["Output", "11,10"]
		],
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


	'task_three_step_arith': {
		'taskID':'task_three_step_arith',
		'instruction': `To teach <code>(Input+1)*(Input-1)</code>, you need to add multiple steps. Note that the ordering of steps does not matter within a case since the computer automatically figures out the dependency between steps, but a consistent ordering is required across cases.`,
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
	'task_number_sort': {
		'taskID':'task_number_sort',
		'instruction': `In the following task, you teach the computer to sort a list of numbers in ascending order. Note that the default example (1,-1&rarr;-1,1) is <em>not sufficient</em>, because the computer will find many other programs ((e.g. <code>Input * -1</code>, <code>Reverse Input</code>) that all calculate the same result.`, 
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


	// 'task_text_sort': {
	// 	'taskID':'task_text_sort',
	// 	'instruction': `The computer can <em>sort text</em>. Lets sort it in descending order this time.`, 
	// 	'description':"Sort text in descending order",
	// 	'example':{
	// 		'input':["a,b"],
	// 		'output':["b,a"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testOutput':function(data){
	// 		var inputValues = _.map(data['input'], function(v){ return str2array(v); });
	// 		var outputValues = _.map(data['output'], function(v){ return str2array(v); });
	// 		var trueOutputValues = _.map(inputValues, function(v){ 
	// 			return v.sort().reverse();
	// 		});
	// 		if(isSameArray(trueOutputValues, outputValues)){
	// 			return { isValid:true, message:MESSAGE_PASS };
	// 		} else {
	// 			return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
	// 		}
	// 	}
	// },

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
	'task_filter_numbers': {
		'taskID':'task_filter_numbers',
		'active': true,
		'instruction': `Teach the computer to perform the following task.`,
		'description':"Find numbers that are not divisible by 4 without remainder",
		'example':{
			'input':["1,4,5"],
			'output':["1,5"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				return _.filter(v, function(vv){ return vv%4!=0; });
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
	// 	'instruction': `The input holds the scores of two exams (Art and Math). Scores follow <span class='value'>NAME:EXAM:SCORE</span> format (e.g. <span class='value'>Lee:Art:87</span> means that Lee got 87 points in the Art exam). The program must get minimum and maximum scores of two exams separately. For example, <span class='value'>[Art, 87, 64]</span> represents that 87 and 64 are max. and min. scores of the Art exam.`,
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
	'task_extract_and_filter': {
		'taskID':'task_extract_and_filter',
		'instruction': `The input represents cars that follow the <span class='value'>MODEL(YEAR)-PRICE</span> format. For instance, <span class='value'>Civic(2014)-$12000</span> represents a Civic manufactured in 2014, and its price is $12000.`,
		'description':"Extract prices of cars that are manufactured in 2014 or later.",
		'partialDescription':["Extract year", "Extract last two digits"],
		'requiredSteps':1,
		'example':{
			'input':["Civic(2014)-$12000, Elantra(2012)-$9500, Corolla(2015)-$14000, Corolla(2013)-$10000"],
			'output':["12000, 14000"],
		},
		'features':{
			"addStep":true,
			"addCase":true,
		},
		'testOutput':function(data){
			var inputValues = _.map(data['input'], function(v){ return str2array(v); });
			var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
			var trueOutputValues = _.map(inputValues, function(v){ 
				var newCars = _.filter(v, function(t){ 
					var year = parseInt(t.match(/\((.+)\)/)[1]);  
					return 2016-year<3;
				});
				return _.map(newCars,function(t){
					var price = parseFloat(t.match(/\$(.*)/)[1]);
					return price;
				});
			});
			if(isSameArray(trueOutputValues, outputValues)){
				return { isValid:true, message:MESSAGE_PASS };
			} else {
				return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
			}
		}
	},


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
	// 'task_find_range': {
	// 	'taskID':'task_find_range',
	// 	'instruction': `Input is a list of lists that hold numbers. Teach the computer to find differences between maximum and minimum values within each list. If a sublist contains less than two numbers, its gap should be 0.`,
	// 	'active':true,
	// 	'description':"Find gaps between minimum and maximum values within each sublist.",
	// 	'partialDescription':["Find maximum values", "Find minimum values", "Calculate gaps"],
	// 	'requiredSteps':2,
	// 	'example':{
	// 		'input':["[6,1,-3], [5,1,2]"],
	// 		'output':["9, 4"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testOutput':function(data){
	// 		var inputValues = _.map(data['input'], function(v){ return str2array(v,"number"); });
	// 		var outputValues = _.map(data['output'], function(v){ return str2array(v,"number"); });
	// 		var trueOutputValues = _.map(inputValues, function(vList){ 
	// 			return _.max(vList) - _.min(vList);
	// 		});
	// 		if(isSameArray(trueOutputValues, outputValues)){
	// 			return { isValid:true, message:MESSAGE_PASS };
	// 		} else {
	// 			return { isValid:false, message:MESSAGE_EXAMPLES_INCONSISTENT_WITH_PROGRAM};
	// 		}
	// 	}
	// },

	// 'task_conditional_replace': {
	// 	'taskID':'task_conditional_replace',
	// 	'instruction': `Input is a list of full names often with titles. For names longer than 10 characters including spaces, the program should abbreviate the middle name (e.g. John Lamar Smith -> John L. Smith). Note that some names may not have middle names.`,
	// 	'description':"Abbreviate the middle name to make it equal or shorter than 10 characters.",
	// 	'partialDescription':["Get lengths of full names", "Find names that are longer than 10 characters", "Abbreviate middle names"],
	// 	'requiredSteps':2,
	// 	'example':{
	// 		'input':["John Lamar Smith, Jon Smith, Kevin Smith"],
	// 		'output':["John L. Smith, Jon Smith, Kevin Smith"],
	// 	},
	// 	'features':{
	// 		"addStep":true,
	// 		"addCase":true,
	// 	},
	// 	'testFunction': function(data){
	// 		return { isValid:true, message:MESSAGE_PASS };
	// 	},
	// },




};