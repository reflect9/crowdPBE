MixedVespy.planner = {

	/*
		Generates plans and operations from user's demonstration on the content element
			e.g. EXTRACT_ELEMENT operation for selected elements
			e.g. (TBD)
	*/
	generateFromDemo: function(currentNode, demo) {
		// demo.clicked is a list of elements clicked.  Call extract_element to find a query
		var op_ext = MixedVespy.planner.operations.extract_element;
		var _O = _.clone(currentNode);
		var solutions = op_ext.generate(currentNode.get_input_nodes(), Array.from(demo.clicked), _O);
		return _.without(solutions, false);
	},
	generateFromCurrentNodeValue: function(currentNode) {
		var Is = currentNode.get_input_nodes();
		var O = _.clone(currentNode);
		// // MULTI_STEP SOLUTIONS
		var multiple_nodes_solutions = [];
		// var multiple_nodes_solutions = _.flatten(_.union(_.map(MixedVespy.planner.tasks, function(task, tname) {
		// 	if (task.pre(Is, O)) {
		// 		var solutions = task.generate(Is,_.clone(O));
		// 		solutions = _.filter(solutions, function(node_list) {
		// 			if (node_list && (!_.isArray(node_list) || node_list.indexOf(false)==-1)) {
		// 				return $.makeArray(node_list);
		// 			} else return false;
		// 		});
		// 		return solutions;
		// 	}
		// })),1);
		// multiple_nodes_solutions= _.filter(multiple_nodes_solutions, function(listofnodes) {
		// 	return listofnodes && listofnodes.length>0 && (listofnodes.indexOf(false)==-1);
		// });
		// SINGLE STEP SOLUTIONS
		var single_node_solutions = _.flatten(_.without(_.map(MixedVespy.planner.operations, function(op, opkey) {
			var desiredValues = O.get_values();
			var generatedSolution = op.generate(Is, desiredValues, O);
			if(typeof generatedSolution == "undefined" || generatedSolution === false) return;
			var single_node_solutions = (_.isArray(generatedSolution))? generatedSolution: [generatedSolution];
			_.each(single_node_solutions, function(s) { 
				s.type = opkey; 
			});
			return single_node_solutions;
		}),false,undefined),1);
		single_node_solutions = _.map(single_node_solutions, function(o) { return $.makeArray(o); });
		return _.without(_.union(multiple_nodes_solutions, single_node_solutions), false, undefined);
	},
	getProto: function(operationKey) {
		// CREATE A NEW "P" based on THE DEFAULT PARAMETERS, TYPE, AND DESCRIPTION
		var op = MixedVespy.planner.operations[operationKey];
		var proto = {
			type: op.type,
			description: op.description,
			param: {}
		} ;
		for(var paramKey in op.parameters) {
			proto.param[paramKey] = op.parameters[paramKey].default;
		}
		return proto;
	},

	attr_func : function(key) {
		var matching_attr = _.filter(MixedVespy.planner.attr_func_list, function(attr) {
			return attr.attr_key == key;
		});
		if(matching_attr.length>0) return matching_attr[0];
		else return false;
	},
	helper_arithmetic: {
		"+": {		
			execute:function(op1, op2) { return parseFloat(op1)+parseFloat(op2); },
			inverse:function(op1, output) { return output-op1; }
		},
		"-": {		
			execute:function(op1, op2) { return parseFloat(op1)-parseFloat(op2); },
			inverse:function(op1, output) { return parseFloat(op1)-parseFloat(output); }
		},
		"*": {		
			execute:function(op1, op2) { return parseFloat(op1)*parseFloat(op2); },
			inverse:function(op1, output) { return output/op1; }
		},
		"/": {		
			execute:function(op1, op2) { return parseFloat(op1)/parseFloat(op2); },
			inverse:function(op1, output) { return parseFloat(op1)/parseFloat(output); }
		},
		"%": {		
			execute:function(op1, op2) { return parseFloat(op1)%parseFloat(op2); },
			inverse:function(op1, output) { return parseFloat(op1)-parseFloat(output); }
		}
	},
	attr_func_list : [
		{	'attr_key': "text",
			'getter': function(el) { 
				var attr = _.escape($(el).text_delimited(" ")).trim();
				if(isNumberString(attr)) return parseFloat(attr); 
				else return attr;
			},
			'setter': function(el,val) { return _.escape($(el).text(val));}
		},
		{	'attr_key': "value",
			'getter': function(el) { 
				if($(el).prop('tagName').toLowerCase()=='input' && $(el).prop('type')=='checkbox') 
					return undefined; // VALUE IS IGNORED FOR CHECKBOXES
				var attr = _.escape($(el).val());
				if(isNumberString(attr)) return parseFloat(attr); 
				else return attr;
			},
			'setter': function(el,val) { return _.escape($(el).val(val));}
		},
		{	'attr_key': "checked",
			'getter': function(el) { return $(el).prop('checked');},
			'setter': function(el,val) { return $(el).prop('checked',val);}
		},
		{	'attr_key': "download", 
			'getter': function(el) { return $(el).attr('download');},
			'setter': function(el,val) { return $(el).attr('download',val);}	
		},
		{	'attr_key': "visibility", 
			'getter': function(el) { return $(el).css('display');},
			'setter': function(el,val) { return $(el).css('display',val);}	
		},
		{	'attr_key': "color", 
			'getter': function(el) { return $(el).css('color');},
			'setter': function(el,val) { return $(el).css('color',val);}	
		},
		{	'attr_key': "background-color", 
			'getter': function(el) { return $(el).css('background-color');},
			'setter': function(el,val) { return $(el).css('background-color',val);}	
		},
		{	'attr_key': "source", 
			'getter': function(el) { return $(el)[0].src;},
			'setter': function(el,val) { return $(el).attr('src',val);}	
		},
		{	'attr_key': "link", 
			'getter': function(el) { return $(el).get(0).href; },
			'setter': function(el,val) { return $(el).attr('href',val);}	
		}
	],
	compare_operation : function(op1, op2) { 
		if(op1.type!==op2.type) return false;
		for(var i in op1.param) {
			if(typeof op2.param[i]==='undefined' || op1.param[i]!==op2.param[i]) return false;
		}
		return true;
	},
	get_options : function(pType, paramKey) {
		var options = MixedVespy.planner.operations[pType].parameters[paramKey].options;
		var option_type = Object.prototype.toString.call(options);
		if ( option_type == "[object Array]") {
			// IF OPTIONS ARE STATIC ARRAY, SIMPLY RETURN THEM
			return options;	
		} else if ( option_type == "[object Function]") {
			// IF OPTIONS ARE DYNAMICALLY GENERATED, RUN IT
			return options();	
		}
	},
	execute : function(O) {
		try {
			if(!O || !O.P) return;
			if(this.operations[O.P.type]) {
				this.operations[O.P.type].execute(O);	
			} else if(this.tasks[O.P.type]) {
				this.tasks[O.P.type].execute(O);	
			}
		} catch(e) { console.error(e.stack); }
	},

	plans: {




	},

	operations: {
		extract_element: {
			type:'extract_element',
			description:"Extract elements at [selector] from [source].",
			parameters:{
				'source': {type:'text', label:"DOM to extract elements from", default:"content", options:["content","input1","input2"]},
				'selector': {type:'text', label:"DOM relative path", default:""}
			},
			generate: function(Is, desiredValues, O) {
				var inputDOM_list = []; // PO
				var valid_O = [];
				if(!desiredValues || desiredValues.length==0 || !isDomList(desiredValues)) return false;
				// PREPARING INPUT DOM LIST
				inputDOM_list.push({
					'source':'content', 
					'domList':$.makeArray($(MixedVespy.contentPath))
				});
				_.each(Is, function(I,idx) {
					if(!I || !isDomList(I.get_values())) return false;
					if(!($.contains(I.get_values()[0],O.get_values()[0]))) return false;
					inputDOM_list.push({
						'source':"input"+(idx+1),
						'domList':I.get_values()
					});
				});
				// FIND EXTRACTION QUERY
				_.each(inputDOM_list, function(inputDOM) {
					var n_extracted_el, n_filtered_el;
					if(inputDOM.domList.length > 1) { // N-TO-N EXTRACTION
						var paths = []; 
						for(var i in desiredValues) // trying with available output examples
							if($.contains(inputDOM.domList[i],desiredValues[i])==false) return false;
						var property_queries = $(inputDOM.domList[i]).findPropertyQuery([desiredValues[i]]);
						var path_queries = $(inputDOM.domList[i]).findPathQuery([desiredValues[i]]);
						paths.push(_.union(property_queries, path_queries));
						console.log("Potential paths: "+paths);
						var common_paths = _.intersection.apply(this,paths); // get common paths;						
						_.each(common_paths, function(path) {
							var _O = new MixedVespy.Node(O);		
							_O.P = MixedVespy.planner.getProto("extract_element");
							_O.P.param.selector = path;	_O.P.param.source = inputDOM.source;
							valid_O.push(_O);
						},this);
					} else if(inputDOM.domList.length==1) {   // 1-TO-N EXTRACTION: Extracting output elements from a single input element
						for(var i in desiredValues)  // CHECK EXISTENCE OF OUTPUT IN INPUT ELEMENT
							if($.contains(inputDOM.domList[0],desiredValues[i])==false) return false;
						var property_queries = $(inputDOM.domList[0]).findPropertyQuery(desiredValues);
						var path_queries = $(inputDOM.domList[0]).findPathQuery(desiredValues);
						var paths = _.union(property_queries, path_queries);
						if(paths.length==0) return false;
						_.each(paths, function(path) {
							var _O = new MixedVespy.Node(O);		
							_O.P = MixedVespy.planner.getProto("extract_element");
							_O.P.param.selector = path;	_O.P.param.source = inputDOM.source;
							valid_O.push(_O);
						},this);
					} else return false;
				},this);
				// console.log(valid_O);
				return (valid_O.length>0)? valid_O:false;
			},
			execute: function(O) {
				var path = O.P.param.selector;
				var new_V = [];
				var inputDOM;
				if(O.P.param.source=="content") inputDOM = $.makeArray($(MixedVespy.contentPath));
				else {
					if(O.P.param.source.match(/input[0-9]/)!==null)  {
						var nth_input = parseInt(O.P.param.source.match(/input([0-9])/)[1])-1; 
						inputDOM = MixedVespy.page.get_node_by_id(O.I[nth_input], O).V;
					} else return;	
				}
				if(typeof inputDOM=='undefined') {
					return;
				}
				if (inputDOM.length!=1) {	// n-to-n extraction
					for(var i in inputDOM) {
						new_V.push($(inputDOM[i]).find(path).get(0));
					}
				} else {	// 1-to-n extraction
					new_V = $(inputDOM[0]).find(path).toArray();
				}
				O.set_values(new_V);
			}
		},
		literal: {
			type:'literal',
			description: 'Create values - [source]',
			parameters: {
				source: {type:'text', label:"Source", default:"input1", options:["input1","input2"]}
			},
			generate: function(Is, desiredValues, O){
				// if(!isValueList(desiredValues) || desiredValues.length==0) return false;
				// var _O = new MixedVespy.Node(O);
				// _O.P = MixedVespy.planner.getProto('literal');
				// _O.P.param.source=JSON.stringify(desiredValues);
				// return [_O];	
			},
			execute: function(O) {
				O.set_values(JSON.parse(O.P.param.source));
			}
		},
		get_attribute: {
			type:'get_attribute', 
			description:"Get [key] of [source].",
			parameters: {
				'source': {type:'text', label:"Source", default:"input1", options:["input1","input2"]},
				'key': {type:'text', label:"Attribute key", default:"text", options:["text","value","checked","download","visibility","color","background-color","source","link"]}
			},
			generate: function(Is, desiredValues, O) {
				// if(!isValueList(O.get_values())) return false;
				// var valid_O = [];
				// _.each(Is, function(I, I_index) {
				// 	if(!I || I.get_values().length==0 || !isDomList(I.get_values()) || !isValueList(desiredValues)) return false;
				// 	var matchingAttrFunc = _.filter(MixedVespy.planner.attr_func_list, function(af) {
				// 		var shorter_length = Math.min(I.get_values().length, desiredValues.length);
				// 		for(var i=0;i<shorter_length;i++) {
				// 			if(af.getter(I.get_values()[i]) != desiredValues[i]) return false;
				// 		}
				// 		return true;
				// 	});
				// 	if(matchingAttrFunc.length>0) {
				// 		var getter_function = MixedVespy.planner.getProto('literal');
				// 		getter_function.param.key = matchingAttrFunc[0].attr_key;
				// 		var _O = new MixedVespy.Node(O);
				// 		_O.P= getter_function;
				// 		_O.P.param.source = "input"+(I_index+1);
				// 		valid_O.push(_O);
				// 	} else return false;
				// },this);
				// return valid_O;
			},
			execute: function(O) {
				var V = MixedVespy.page.get_node_by_position(O.P.param.source).get_values();
				var getter = (_.filter(MixedVespy.planner.attr_func_list, function(f){ return f.attr_key==O.P.param.key; })[0]).getter;
				var new_V = _.map(V, function(el_input) {
					if(typeof el_input!=='undefined') {
						return this.getter(el_input);	
					} else {
						return null;
					}
				}, {'getter':getter});
				O.set_values(new_V);
			}
		},
		substring: {
			type:'substring',
			description: "Get part of text in [source] using [regex].",
			// description: "Get part of text in [source] from [from] to [to], including from([include_from]]) and to([include_to]).",
			parameters: {
				source: {type:'text', label:"Source", default:"input1", options:["input1","input2"]},
				regex: {type:'text', label:"Regular Expression", default:".*"}
			},
			generate: function(Is, desiredValues, O) {
				// Wizard of Oz method does not need generator
			},
			execute: function(O) {
				var inputNodePosition = O.P.param.source;
				var I = MixedVespy.page.get_node_by_position(inputNodePosition);
				if(!I || !I.get_values() || (!isStringList(I.get_values()) && !isNumberList(I.get_values()))) return O; 
				var sourceV;
				if (isNumberList(I.get_values())) {
					sourceV = _.map(I.get_values(), function(v){ return ""+v; });
				} else sourceV = I.get_values();
				var re = new RegExp(O.P.param.regex);
				// RUN SUBSTRING
				O.set_values(_.map(sourceV, function(input) { 
					var result = input.match(re);
					if(result) return result[1];
					else return null;
				}));
			}
		},
		count: {
			type:'count',
			description: "Count items in [source].",
			parameters: {
				'source': {type:'text', label:"Elements to count", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I = MixedVespy.page.get_node_by_position(O.P.param.source);
				O.set_values([I.get_values().length]);
			}
		},
		sum: {
			type:'sum',
			description: "Add all numbers in [source].",
			parameters: {
				'source': {type:'text', label:"Elements to add up", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I = MixedVespy.page.get_node_by_position(O.P.param.source);
				var inputValues = I.get_values();
				var sum = 0;
				for(var i=0;i<inputValues.length;i++) {
					sum = sum + inputValues[i];
				}
				O.set_values([sum]);
			}
		},
		min: {
			type:'min',
			description: "Find the minimum value of [source].",
			parameters: {
				'source': {type:'text', label:"", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I = MixedVespy.page.get_node_by_position(O.P.param.source);
				var inputValues = I.get_values();
				O.set_values([_.min(inputValues)]);
			}
		},
		max: {
			type:'max',
			description: "Find the maximum value of [source].",
			parameters: {
				'source': {type:'text', label:"", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I = MixedVespy.page.get_node_by_position(O.P.param.source);
				var inputValues = I.get_values();
				O.set_values([_.max(inputValues)]);
			}
		},
		average: {
			type:'average',
			description: "Find the average value of [source].",
			parameters: {
				'source': {type:'text', label:"", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I = MixedVespy.page.get_node_by_position(O.P.param.source);
				var inputValues = I.get_values();
				O.set_values([  inputValues.reduce((a, b) => a + b, 0) / inputValues.length ]);
			}
		},
		sort: {
			type:'sort',
			description: "Sort [source] by [score] in [direction]-order.",
			parameters: {
				'source': {type:'text', label:'list to sort', default:'input1', options:["input1","input2"] },
				'score': {type:'text', label:'score to sort by', default:'input1', options:["input1","input2"] },
				'direction': {type:'text', label:'increasing or decreasing', default:'increasing', options:["increasing","decreasing"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I_source = MixedVespy.page.get_node_by_position(O.P.param.source);
				var I_score = MixedVespy.page.get_node_by_position(O.P.param.score);
				var V_source = I_source.get_values();
				var V_score = I_score.get_values();
				var V_sorted = (_.sortBy(V_source, function(v,i){
					return V_score[i];
				}));
				if(O.P.param.direction=='decreasing') V_sorted.reverse();
				O.set_values(V_sorted);
				// append to the enclosing element if the V is elements
				if(isDomList(V_sorted)) {
					var parent_el = $(V_sorted[0]).parent();
					$(V_sorted).appendTo(parent_el);	
				}
			}
		},
		unique: {
			type:'unique',
			description: "Get list of unique elements of [source].",
			parameters: {
				'source': {type:'text', label:"Elements to get ", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O){

			},
			execute: function(O){
				var I = MixedVespy.page.get_node_by_position(O.P.param.source);
				var V = _.without(I.get_values(),null);
				var V_no_repeat = _.map(V, function(v) { return v.trim(); });
				O.set_values(_.unique(V_no_repeat));
			}
		},
		arithmetic_single_param: {
			type:'arithmetic_single_param',
			description: "Calculate [operand_A] [operator] [operand_B]",
			parameters: {
				operator: {type:'text', label:'Operation (e.g. +, -, *, /, %', default:"+", options:["+","-","*","/","%"]},
				operand_A: {type:'text', label:'First operand', default:"input1", options:["input1","input2"]},
				operand_B: {type:'text', label:'Second operand', default:"input2", options:["input1","input2"]}
			},
			generate: function(Is, O) {
				// NO NEED FOR WOZ
			}, 
			execute: function(O) {
				var operator = O.P.param.operator;
				var operand = O.P.param.operand_B;
				var V = MixedVespy.page.get_node_by_position(O.P.param.operand_A).get_values();
				var result = _.map(V, function(v) {
					return MixedVespy.planner.helper_arithmetic[operator].execute(v, operand);
				});
				O.set_values(result);
			}
		},
		arithmetic_multiple_param: {
			type:'arithmetic_multiple_param',
			description: "Calculate [operand_A] [operator] [operand_B]",
			parameters: {
				operator: {type:'text', label:'Operation (e.g. +, -, *, /, %', default:"+", options:["+","-","*","/","%"]},
				operand_A: {type:'text', label:'First operand', default:"input1", options:["input1","input2"]},
				operand_B: {type:'text', label:'Second operand', default:"input2", options:["input1","input2"]}
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var operator = O.P.param.operator;
				var V_operandA = MixedVespy.page.get_node_by_position(O.P.param.operand_A).get_values();
				var V_operandB = MixedVespy.page.get_node_by_position(O.P.param.operand_B).get_values();
				var result = _.map(V_operandA, function(v, i) {
					var result = MixedVespy.planner.helper_arithmetic[operator].execute(v, V_operandB[i]);
					return (isNaN(result)) ? null : result; 
				});
				O.set_values(result);
			}
		},

		////////////////////////////////////////////////////////////////////////////////////
		// FILTER-RELATED OPERATIONS
		////////////////////////////////////////////////////////////////////////////////////
		filter: {
			type:'filter',
			description: "Filter items in [items] by [true_or_false] of [booleans].",
			parameters: {
				items: {type:'text', label:'Items to filter', default:"input1", options:["input1","input2"]},
				true_or_false: {type:'text', label:'true or false to filter in', default:"true", options:["true","false"]},
				booleans: {type:'text', label:'Boolean(true/false) values for filtering', default:"input2", options:["input1","input2"]},
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var items_to_filter = MixedVespy.page.get_node_by_position(O.P.param.items).get_values();
				var flags = MixedVespy.page.get_node_by_position(O.P.param.booleans).get_values();
				var result = _.filter(items_to_filter, function(item, i){
					return flags[i];
				});
				O.set_values(result);
			}
		},
		number_test: {
			type: "number_test",
			description: "Evaluate [operand_A] [operator] [operand_B].",
			parameters: {
				operator: {type:'text', label:'Operation', default:"==", options:["<","<=",">",">=","==","%","!%"]},
				operand_A: {type:'text', label:'First operand', default:"input1", options:["input1","input2"]},
				operand_B: {type:'text', label:'Second operand', default:"0", options:["input1","input2"]}
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var V1 = MixedVespy.page.get_node_by_position(O.P.param.operand_A).get_values();
				var V2 = MixedVespy.page.get_node_by_position(O.P.param.operand_B).get_values();
				var result = _.map(_.zip(V1, V2), function(bothV, i){
					return MixedVespy.planner.operations.number_test.helper_number_test(bothV[0], bothV[1], O.P.param.operator);
				});
				O.set_values(result);
			},
			helper_number_test: function(op1, op2, operator) {
				if(operator=="<") return op1<op2;
				if(operator==">") return op1>op2;
				if(operator=="<=") return op1<=op2;
				if(operator==">=") return op1>=op2;
				if(operator=="==") return op1==op2;
				if(operator=="%") return op1%op2==0;
				if(operator=="!%") return op1%op2!=0;
			}
		},
		string_test: {
			type: "string_test",
			description: "Test whether [key] is [isIn] [source] .",
			parameters: {
				source:{ type:'text', label:"String set to look at", default:'input1', options:["input1","input2"]},
				key:{ type:'text', label:"Sub-string to look for or input node", default:'input2', options:["input1","input2"]},
				isIn:{ type: 'text', label: "Sub-string must be 'in' or 'not in'", default:'in', options:["in","not in"]}
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var sourceV = MixedVespy.page.get_node_by_position(O.P.param.source).get_values();
				var keys = O.P.param.key;
				keys = (key.match(/[A-Z]+/) !== null) 
					? MixedVespy.page.get_node_by_position(key) : [key];
				O.set_values(_.map(sourceV, function(v){
					_.some(keys, function(k) {
						var isIn = v.toString().toLowerCase().indexOf(k.toString().toLowerCase()) != -1;
						return (O.P.param.isIn == "in")? isIn : !isIn;
					});
				}));
			}
		},

		////////////////////////////////////////////////////////////////////////////////////
		// FOR DOM MODIFICATIONS
		////////////////////////////////////////////////////////////////////////////////////
		delete: {
			type: "delete",
			description:"Delete [target].",
			parameters: {
				'target': {type:'text', label:"Elements to delete", default:"input1", options:["input1","input2"]},
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var elements = MixedVespy.page.get_node_by_position(O.P.param.target).get_values();
				$(elements).remove();
			}
		},
		set_attribute: {
			type: "set_attribute",
			description:"Set [key] attributes of [target] to [new_value].",
			parameters: {
				'key': {type:'text', label:"Attribute to set", default:"text", options:["text","value","download","visibility","color","background-color","source","link"]},
				'target': {type:'text', label:"Original Value", default:"input1", options:["input1","input2"]},
				'new_value': {type:'text', label:"New Value", default:"input2", options:["input1","input2"]},
				'repeat_values': {type:'boolean', label:"Repeat if values are fewer than targets", default:true}
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var targetV = MixedVespy.page.get_node_by_position(O.P.param.target).get_values();
				var newV = MixedVespy.page.get_node_by_position(O.P.param.new_value).get_values();
				var valuesToUpdate = O.P.param.new_value;
				valuesToUpdate = (valuesToUpdate.match(/[A-Z]+/) !== null) 
					? MixedVespy.page.get_node_by_position(valuesToUpdate) : [valuesToUpdate];
				var setter = (_.filter(MixedVespy.planner.attr_func_list, function(f){ return f.attr_key==O.P.param.key; },this)[0]).setter;
				var result = _.map(targetV, function(v,i) {
					if(O.P.param.repeat_values) {
						return setter(v, valuesToUpdate[i % valuesToUpdate.length]);
					} else {
						if(i < valuesToUpdate.length) return setter(v, valuesToUpdate[i]);
					}
				})
				O.set_values(result);
			}
		},
		create_element: {
			type: "create_element",
			description: "Create [tag] elements using the [value], and attach to [target].",
			parameters: {
				value: {type:'text', label:"Value", default:"input1", options:["input1","input2"]},
				target: {type:'text', label:"Target elements", default:"input1", options:["input1","input2"]},
				tag: {type:'text', label:'Tag', default:"span", options:["span","p","button","text input","checkbox","dropdown","img","li"]}
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				var valuesToCreate = O.P.param.value;
				valuesToCreate = (valuesToCreate.match(/[A-Z]+/) !== null) 
					? MixedVespy.page.get_node_by_position(valuesToCreate).get_values() : [valuesToCreate];
				var targets = MixedVespy.page.get_node_by_position(O.P.param.target).get_values();
				var result = _.map(_.zip(valuesToCreate,targets), function(v_t,i){
					var el = MixedVespy.planner.operations.create_element.helper_create_element(O.P.param.tag, v_t[0]);
					$(v_t[1]).append(el);
					return el;
				});
				O.set_values(result);
			},
			helper_create_element: function(tag,value) {
				if(tag=="span") return $("<span class='pg_created_element'>"+value+"</span>")[0];
				if(tag=="p") return $("<p class='pg_created_element'>"+value+"</p>")[0];
				if(tag=="button") return $("<button class='pg_created_element'>"+value+"</button>")[0];
				if(tag=="text input") return $("<input type='text' class='pg_created_element' value='"+value+"'/>")[0];
				if(tag=="checkbox") return $("<input  class='pg_created_element' type='checkbox' name='"+value+"'/><span>"+value+"</span>")[0];
				if(tag=="img") return $("<img class='pg_created_element' src='"+value+"'></img>")[0];
				if(tag=="li") return $("<li class='pg_created_element'>"+value+"</li>")[0];
				return false;
			},
		},
		pack_element: {
			type: "pack_element",
			description: "Create [tag] elements containing all the inputs.",
			parameters: {
				sources: {type:'text', label:"Sources", default:"_prev"},
				tag: {type:'text', label:'Tag', default:"span", options:["div","span","p","ul","ol","li"]}
			},
			generate: function(Is, O) {

			}, 
			execute: function(O) {
				//
			}
		}

	}


};