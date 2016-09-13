CrowdPlanner = {
	

	inferSingleStep: function(previousSteps, currentStep) {
		var matchingPrograms=[];
		for(var opKey in CrowdPlanner.operations) {
			var opObj = CrowdPlanner.operations[opKey];
			try {
				var pList = opObj.generate(previousSteps, currentStep);
				if(_.isArray(pList))  matchingPrograms=matchingPrograms.concat(pList);
			} catch(e) {	console.log(e);	  }
		};
		return matchingPrograms;
	},
	runUnitTest: function() {
		_.each(CrowdPlanner.operations, function(opObj, opKey) {
			try {
				console.log("========================"+opKey);
				if(opObj.unitTests) {
					_.each(opObj.unitTests, function(test, testI) {
						var generatedP = opObj.generate(test.inputs, test.output);
						if (generatedP.length>1) {
							console.log(generatedP);
							throw "Multiple P generated";
						}	else if(generatedP.length==0) {
							throw "No P generated";	
						} 
						else {
							if(isSameProgram(generatedP[0], test.program)){
								console.log("pass");
							} else {
								throw opKey + " test " + testI + " failed";
							}
						}
					});
				}
			} catch(e) {
				console.error(e);
				console.error(e.stack);
			}
		});
	},

	operations: {
		substring: {  // character C의 n번째 occurrence를 경계삼아서 substring. 
			generate: function(Is, O) {
				var Ps = [];
				// VALIDATING OUTPUT
				if(O.length==0 || !isStringList(O)) return false;
				var oValues = _.map(O, function(v){return str2array(v); });
				var flat_O_values = _.flatten(oValues);
				if(flat_O_values.length==0) return false;
				_.each(Is, function(I, I_index) {
					// VALIDATE INPUT
					if(!isStringList(I) || I.length==0) return false;
					var I_values = _.map(I, function(v){ return str2array(v); });
					var flat_I_values = _.flatten(I_values);
					var all_list = flat_I_values.concat(flat_O_values);
					if(flat_I_values.length != flat_O_values.length) return false;
					// CHECKING SUBSTRINg IS SAME AS ORIGINAL LIST
					var isAllSame = true;
					for(var i=0; i<Math.min(flat_O_values.length, flat_I_values.length);i++) {
						if(flat_I_values[i].indexOf(flat_O_values[i])==-1) return false;
						if(flat_I_values[i]!=flat_O_values[i]) isAllSame = false;
					}
					if (isAllSame) return false;	// don't need to substring 
					// INFER
					var validCombination = [];
					var sharedTokens = CrowdPlanner.get_common_tokens(flat_I_values);
					for(var s_tok_i in sharedTokens) {
						for(var e_tok_i in sharedTokens) {
							var s_t = sharedTokens[s_tok_i];	var e_t = sharedTokens[e_tok_i];
							// 1. inclusive(S)-exclusive(E) case. 
							var trial_output = [];
							for(var i=0;i<flat_I_values.length;i++) {
								var s_i = flat_I_values[i].indexOf(s_t);
								var e_i = flat_I_values[i].indexOf(e_t, s_i+1);
								if(s_i==-1) s_i = flat_I_values[i].length;
								if(e_i==-1) e_i = flat_I_values[i].length;
								if(s_i < e_i) trial_output.push(flat_I_values[i].substring(s_i,e_i));
								else trial_output.push("");
							}
							if (isSameArray(trial_output, flat_O_values)) 
								validCombination.push({'from':s_t, 'to':e_t, 'include_from':true, 'include_to':false});	
							// 2. inclusive(S)-inclusive(E) case. 
							var trial_output = [];
							for(var i=0;i<flat_I_values.length;i++) {
								var s_i = flat_I_values[i].indexOf(s_t);
								var e_i = flat_I_values[i].indexOf(e_t, s_i+1);
								if(s_i==-1) s_i = flat_I_values[i].length;
								if(e_i==-1) e_i = flat_I_values[i].length;
								if(s_i < e_i) trial_output.push(flat_I_values[i].substring(s_i,e_i+e_t.length));
								else trial_output.push("");
							}
							if (isSameArray(trial_output, flat_O_values)) 
								validCombination.push({'from':s_t, 'to':e_t, 'include_from':true, 'include_to':true});
							// 3. exclusive(S)-exclusive(E) case. 
							var trial_output = [];
							for(var i=0;i<flat_I_values.length;i++) {
								var s_i = flat_I_values[i].indexOf(s_t);
								var e_i = flat_I_values[i].indexOf(e_t, s_i+1);
								if(s_i==-1) s_i = flat_I_values[i].length;
								if(e_i==-1) e_i = flat_I_values[i].length;
								if(s_i < e_i) trial_output.push(flat_I_values[i].substring(s_i+s_t.length,e_i));
								else trial_output.push("");
								
							}
							if (isSameArray(trial_output, flat_O_values))
								 validCombination.push({'from':s_t, 'to':e_t, 'include_from':false, 'include_to':false});
							// 4. exclusive(S)-inclusive(E) case. 
							var trial_output = [];
							for(var i=0;i<flat_I_values.length;i++) {
								var s_i = flat_I_values[i].indexOf(s_t);
								var e_i = flat_I_values[i].indexOf(e_t, s_i+1);
								if(s_i==-1) s_i = flat_I_values[i].length;
								if(e_i==-1) e_i = flat_I_values[i].length;
								if(s_i < e_i) trial_output.push(flat_I_values[i].substring(s_i+s_t.length,e_i+e_t.length));
								else trial_output.push("");
							}
							if (isSameArray(trial_output, flat_O_values)) 
								validCombination.push({'from':s_t, 'to':e_t, 'include_from':false, 'include_to':true});
						} // END OF e_tok_i
					} // END OF s_tok_i
					// console.log("found substring combinations: "+validCombination);
					// CREATING P
					_.each(validCombination, function(vc) {
						Ps.push({
							type:'substring',      
							param:{
								inputIndex: ""+I_index,
								source:I_index,
								from:vc["from"],
								to:vc["to"],
								include_from:vc["include_from"],
								include_to:vc["include_to"],
							},
						});
					});
				});
				if(Ps.length>0) return [Ps[0]];
				else return Ps;
			},
			execute: function(previousSteps, P) {
				var inputValues = previousSteps[P.param.source];
				var resultData = _.map(inputValues, function(iv){
					var start_pos, end_pos;
					start_pos = (P.param.include_from)? iv.indexOf(P.param.from): iv.indexOf(P.param.from)+P.param.from.length;
					if(iv.indexOf(P.param.to,start_pos+1)==-1) end_pos = iv.length;
					else {
						end_pos = (P.param.include_to)? iv.indexOf(P.param.to,start_pos+1)+P.param.to.length: iv.indexOf(P.param.to,start_pos+1);
					}
					start_pos = Math.max(0,start_pos); end_pos = Math.max(0,end_pos);
					return iv.substring(start_pos,end_pos);
				});
				// RETURNS DATA ONLY
				return resultData;
			},
			unitTests: [
				{	inputs:[
						["a-b","b-c"],
						["abe","cde"]
					],
					output: [ "b", "c"],
					program: {
						type:"substring",
						param: {
							inputIndex: "0",
							source:0,
							from:"-",
							to:"____end_of_line___",
							include_from:false,
							include_to:false,
						}
					}
				},
				{	inputs:[
						["a-b","b-c"],
						["a-b,b-c","b-c,d-e"],
						["abe","cde"]
					],
					output: ["b,c", "c,e"],
					program: {
						type:"substring",
						param: {
							inputIndex: "1",
							source:1,
							from:"-",
							to:"____end_of_line___",
							include_from:false,
							include_to:false,
						}
					}
				}
			]
		},
		// compose_text: {
		// 	// 두 개의 string셋을 합침
		// 	generate: function(Is, O) {
		// 		if(Is.length<2) return false;
		// 		var Ps = [];
		// 		var find_P = function(O, I1, I2, nth_A, nth_B) {
		// 			// FINDING CONNECTOR STRING COMMONLY APPLICABLE FOR ALL CASES
		// 			var connector_for_all_cases = _.map(O, function(ov, idx){
		// 				var cand_con;
		// 				var input_values1 = _.map(I1[idx], function(iv){ return str2array(iv); });
		// 				var input_values2 = _.map(I2[idx], function(iv){ return str2array(iv); });


		// 				var regex_for_connector = new RegExp(input_values1[idx] + "(.*)" + I2[idx],"g");
		// 				var matched_for_connector = ov.match(regex_for_connector); 
		// 				if(matched_for_connector) {
		// 					cand_con = matched_for_connector[1];
		// 				}
		// 				if (I1[idx]+cand_con+I2[idx] == ov) {
		// 					return cand_con;
		// 				} else {
		// 					return false;
		// 				}
		// 			}); 
		// 			var common_connectors = _.intersect.apply(this, connector_for_all_cases);
		// 			var connector;
		// 			if(common_connectors.length==0) throw "Fail to find a connector."; 
		// 			else connector = common_connectors[0];
		// 			// APPLYING CONNECTOR TO GET TRUE RESULT OF COMPOSITION
		// 			var composed_string = _.map(I1, function(iv1, idx){
		// 				return I1[idx] + common_connector + I2[idx];
		// 			}); 
		// 			if(isSameList(composed_string, O)){
		// 				return {
		// 					type:"compose_text",
		// 					param:{	connector:connector,
		// 							text_A:nth_A,
		// 							text_B:nth_B	}
		// 				};	
		// 			} else {
		// 				throw "Fail to find a connector."; 
		// 			}
		// 		};
		// 		// Try all combinations of two Is
		// 		var comb_two_Is = pickCombination(_.range(Is.length), 2, true);
		// 		_.each(comb_two_Is, function(i1,i2){
		// 			try {
		// 				Ps.push(find_P(O, Is[i1], Is[i2], i1, i2));	
		// 			} catch(e){
		// 				// FOUND NO CONNECTOR FOR THE PAIR OF INPUT
		// 				if(e=="Fail to find a connector.") console.log(e);
		// 			}
		// 		});
		// 		// Ps = _.without(Ps,false);
		// 		return Ps;	
		// 	},
		// 	execute: function(previousSteps, P) {
		// 		var I1 = previousSteps[P.param.text_A];
		// 		var I2 = previousSteps[P.param.text_B];
		// 		return _.map(I1, function(st1, idx) {
		// 			return st1 + P.param.connector + I2[idx];
		// 		});
		// 	},
		// 	unitTests: [
		// 		{	inputs:["abc, def"," ghi  , jkl"],
		// 			output: [ "abc-ghi", "def-jkl"],
		// 			program: {
		// 				type:"compose_text",
		// 				param: {
		// 					connector:"-",
		// 					text_A:0,
		// 					text_B:1,
		// 				}
		// 			}
		// 		}
		// 	]
		// },
		text_length: {
			// text길이 구하기 
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(ov){ return str2array(ov, "number"); }); 
				_.each(Is, function(I,I_index){
					var input_values_as_text = _.map(I, function(iv){	return str2array(iv); });
					var input_values_length = _.map(input_values_as_text, function(iv){
						return _.map(iv, function(v){  return v.length; }); 
					});
					if(isSameArray(input_values_length, oValues)) {
						Ps.push({
							type:"text_length",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				return _.map(I, function(v){return v.length; });
			},
			unitTests: [
				{	inputs:[
						["abc, def", " ghi  , jkl" ], 
						["a, b", "" ]
					],
					output: [ "3,3", "3,3"],
					program: {
						type:"text_length",
						param: {
							source : 0,
							inputIndex: "0",
						}
					}
				},
				{	inputs:[
						["abc, def"], 
						["aaa, b   b"]
					],
					output: [ "3,5"],
					program: {
						type:"text_length",
						param: {
							source : 1,
							inputIndex: "1",
						}
					}
				}
			]
		},
		count: {
			// 리스트에서 element갯수 
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return parseInt(v); }); //  O: ["2", "2"]
				_.each(Is, function(I,I_index){
					var length_of_input = _.map(I, function(iv){ return str2array(iv).length; });
					if(isSameArray(length_of_input, oValues)) {
						Ps.push({
							type:"count",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				return _.map(I, function(v){return str2array(v).length; });
			},
			unitTests: [
				{	inputs:[
						["abc, def", " ghi  , jkl" ], 
						["a, b", "" ]
					],
					output: [ "2", "2" ],
					program: {
						type:"count",
						param: {
							source : 0,
							inputIndex: ""+0,
						}
					}
				}
			]
		},
		sum: {
			generate: function(Is, O) {
				var Ps = [];
				// oValue
				var oValues = _.map(O, function(v){return parseFloat(v); });
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
					} catch(e){
						return;
					}
					var true_sum = _.map(inputValues, function(iv){ return sum(iv); });
					if(isSameArray(true_sum, oValues)) {
						Ps.push({
							type:"sum",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
				return _.map(inputValues, function(v){return sum(v); });
			},
			unitTests: [
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "8", "3" ],
					program: {
						type:"sum",
						param: {
							source : 0,
							inputIndex: ""+0,
						}
					}
				},
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "3", "36" ],
					program: {
						type:"sum",
						param: {
							source : 1,
							inputIndex: ""+1,
						}
					}
				}
			]
		},
		min: {
			generate: function(Is, O) {
				var Ps = [];
				// oValue :
				var oValues = _.map(O, function(v){return str2array(v,"number"); });
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
					} catch(e){
						return;
					}
					var true_min = _.map(inputValues, function(iv){ 
						return [Math.min.apply(this,iv)]; 
					});
					if(isSameArray(true_min, oValues)) {
						Ps.push({
							type:"min",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
				return _.map(inputValues, function(v){return 
					Math.min.apply(this,v); 
				});
			},
			unitTests: [
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "3", "1" ],
					program: {
						type:"min",
						param: {
							source : 0,
							inputIndex: ""+0,
						}
					}
				},
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "1", "2" ],
					program: {
						type:"min",
						param: {
							source : 1,
							inputIndex: ""+1,
						}
					}
				}
			]
		},
		max: {
			generate: function(Is, O) {
				var Ps = [];
				// oValue :
				var oValues = _.map(O, function(v){return str2array(v, "number"); });
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
					} catch(e){
						return;
					}
					var true_max = _.map(inputValues, function(iv){ 
						return [Math.max.apply(this,iv)]; 
					});
					if(isSameArray(true_max, oValues)) {
						Ps.push({
							type:"max",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
				return _.map(inputValues, function(v){return 
					Math.max.apply(this,v); 
				});
			},
			unitTests: [
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "5", "2" ],
					program: {
						type:"max",
						param: {
							source : 0,
							inputIndex: ""+0,
						}
					}
				},
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "1", "29" ],
					program: {
						type:"max",
						param: {
							source : 1,
							inputIndex: ""+1,
						}
					}
				}
			]
		},
		reverse_array: {
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return str2array(v); });
				var isAllOutputValuesEmptyString = _.every(oValues, function(o){
					return o.length==1 && o[0]=="";
				});
				if(isAllOutputValuesEmptyString) return false;
				for(var I_idx in Is) {
					var I = Is[I_idx];
					try {
						var I_vals_reversed = _.map(I,function(v){ 
							var list = str2array(v); 
							list.reverse();
							return list;
						});
					} catch(e){
						return;
					}
					if(isSameArray(oValues, I_vals_reversed)) {
						Ps.push({
							type:"reverse_array",
							param:{
								source:I_idx,
								inputIndex: ""+I_idx
							}
						});
					}
				}
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				var result = _.map(I, function(iv){ 
					var arr =  str2array(iv); 
					arr.reverse();
					return arr;
				});	
				return result;
			}, 
			unitTests: [
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "1,1,1", "29,2,5" ],
					program: {
						type:"reverse_array",
						param: {
							source : 1,
							inputIndex: ""+1,
						}
					}
				},
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "5,3", "1,2" ],
					program: {
						type:"reverse_array",
						param: {
							source : 0,
							inputIndex: ""+0,
						}
					}
				},
			]
		},

		sort_number: {
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return str2array(v, "number"); });
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
					} catch(e){
						return;
					}
					var sorted_ascending = _.map(inputValues, function(iv){ 
						return sortGeneral(iv); 
					});
					var sorted_descending = _.map(inputValues, function(iv){
						return sortGeneral(iv).reverse();
					});
					if(isSameArray(sorted_ascending, oValues)) {
						Ps.push({
							type:"sort_number",
							param: {
								ascending:true,
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
					if(isSameArray(sorted_descending, oValues)) {
						Ps.push({
							type:"sort_number",
							param: {
								ascending:false,
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				if(P.param.ascending) {
					return _.map(I, function(iv){ return sortGeneral(str2array(iv,"number")); });	
				} else {
					return _.map(I, function(iv){ return sortGeneral(str2array(iv,"number")).reverse(); });	
				}
			},
			unitTests: [
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "3,5", "1,2" ],
					program: {
						type:"sort_number",
						param: {
							ascending:true,
							source : 0,
							inputIndex: ""+0,
						}
					}
				},
				{	inputs:[
						["3,5", "2,1" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "1,1,1", "29,5,2" ],
					program: {
						type:"sort_number",
						param: {
							ascending:false,
							source : 1,
							inputIndex: ""+1,
						}
					}
				}
			]
		},
		sort_text: {
			generate: function(Is, O) {
				var Ps = [];
				// EXCLUDE THE CASE WHERE INPUT IS ALL NUMBERS
				var isOutputNumber;
				try {
					var dummy = _.map(O, function(v){return str2array(v, "number");  });
					 isOutputNumber = true;
				} catch(o) {
					if(o=="Not Number") isOutputNumber=false;
				}
				if(isOutputNumber) return[];
				//
				var oValues = _.map(O, function(v){return str2array(v); });
				var isAllOutputValuesEmptyString = _.every(oValues, function(o){
					return o.length==1 && o[0]=="";
				});
				if(isAllOutputValuesEmptyString) return false;
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv); });
					} catch(e){
						return;
					}
					var sorted_ascending = _.map(inputValues, function(iv){ 
						return sortGeneral(iv); 
					});
					var sorted_descending = _.map(inputValues, function(iv){
						return sortGeneral(iv).reverse();
					});
					if(isSameArray(sorted_ascending, oValues)) {
						Ps.push({
							type:"sort_text",
							param: {
								ascending:true,
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
					if(isSameArray(sorted_descending, oValues)) {
						Ps.push({
							type:"sort_text",
							param: {
								ascending:false,
								source: I_index,
								inputIndex: ""+I_index,
							}
						});
					}
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				if(P.param.ascending) {
					return _.map(I, function(iv){ return sortGeneral(str2array(iv,"number")); });	
				} else {
					return _.map(I, function(iv){ return sortGeneral(str2array(iv,"number")).reverse(); });	
				}
			},
			unitTests: [
				{	inputs:[
						["a,b", "d,c" ], 
						["a,a,a", "f,b,   z" ]
					],
					output: [ "a,b", "c,d" ],
					program: {
						type:"sort_text",
						param: {
							ascending:true,
							source : 0,
							inputIndex: ""+0,
						}
					}
				},
				{	inputs:[
						["a,b", "d,c" ], 
						["a,a,a", "f,b,   z" ]
					],
					output: [ "a,a,a", "z,f,b" ],
					program: {
						type:"sort_text",
						param: {
							ascending:false,
							source : 1,
							inputIndex: ""+1,
						}
					}
				}
			]
		},
		sort_by_key: {
			// 키값이 따로 주어짐. 그걸 이용해서 소팅.  
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return str2array(v); });
				if(Is.length<2) return [];
				for(var idxI=0; idxI<Is.length-1; idxI++) {
					for(var idxK=idxI+1; idxK<Is.length; idxK++) {
						var I = Is[idxI];
						var K = Is[idxK];
						var I_values = _.map(I, function(iv){ return str2array(iv); });
						var K_values = _.map(K, function(kv){ return str2array(kv); });
						if(!isSameShape(I_values, K_values)) continue;
						// GET TRUE SORTED I_values
						var true_sorted_ascending= _.map(I_values, function(values,value_i){
							return _.sortBy(values, function(v,sort_i){ return K_values[value_i][sort_i]; });
						});
						var true_sorted_descending= _.map(I_values, function(values,value_i){
							return _.sortBy(values, function(v,sort_i){ return K_values[value_i][sort_i]; }).reverse();
						});
						if(isSameArray(true_sorted_ascending, oValues)) {
							Ps.push({
								type:"sort_by_key",
								param: {
									ascending:true,
									source: idxI,
									key: idxK,
									inputIndex: ""+idxI+","+idxK,
								}
							});
						}
						if(isSameArray(true_sorted_descending, oValues)) {
							Ps.push({
								type:"sort_by_key",
								param: {
									ascending:false,
									source: idxI,
									key: idxK,
									inputIndex: ""+idxI+","+idxK,
								}
							});
						}
					}
				}
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				if(P.param.ascending) {
					return _.map(I, function(iv){ return sortGeneral(str2array(iv,"number")); });	
				} else {
					return _.map(I, function(iv){ return sortGeneral(str2array(iv,"number")).reverse(); });	
				}
			},
			unitTests: [
				{	inputs:[
						["ab, kde, defg", "defg, ac" ], 
						["abc", "de" ],
						["2,3,4", "4,2" ]
					],
					output: [ "defg, kde, ab", "defg, ac"],
					program: {
						type:"sort_by_key",
						param: {
							ascending:false,
							source : 0,
							key: 2,
							inputIndex: ""+0+","+2,
						}
					}
				},
				{	inputs:[
						["abc", "de" ],
						["ab, kde, defg", "defg, ac" ], 
						["2,3,4", "4,2" ]
					],
					output: [ "ab, kde, defg", "ac, defg"],
					program: {
						type:"sort_by_key",
						param: {
							ascending:true,
							source : 1,
							key:2,
							inputIndex: ""+1+","+2,
						}
					}
				}
			]
		},
		arithmetic_single_param: {
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return str2array(v, "number"); });
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
					} catch(e){
						return;
					}
					// CHECK MINIMAL CONDITIONS (WHETHER ITEM NUMBERS ARE MATCHING)
					if(!isSameShape(oValues,inputValues)) return;
					// TRYING DIFFERENT ARITHMETIC OPERATORS 
					var validOperators = CrowdPlanner.findFormulaSingleParam(inputValues, oValues);
					_.each(validOperators, function(op){
						Ps.push({
							type: "arithmetic_single_param",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
								operator: op[0],
								operand: op[1],
							}
						});
					});
				});
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I = previousSteps[P.param.source];
				var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
				return _.map(inputValues, function(v){return sum(v); });
			},
			unitTests: [
				{	inputs:[
						[],
						["0", "9", "3" ], 
						[],
						[],
					],
					output: [ "0", "3", "1" ],
					program: {
						type:"arithmetic_single_param",
						param: {
							source : 1,
							inputIndex: ""+1,
							operator: "/",
							operand: 3
						}
					}
				},
				{	inputs:[
						["3", "9" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "4", "10" ],
					program: {
						type:"arithmetic_single_param",
						param: {
							source : 0,
							inputIndex: ""+0,
							operator: "+",
							operand: 1
						}
					}
				},
				{	inputs:[
						["3", "9" ], 
						["1,1,1", "5,2,   29" ]
					],
					output: [ "3,3,3", "15,6,87" ],
					program: {
						type:"arithmetic_single_param",
						param: {
							source : 1,
							inputIndex: ""+1,
							operator: "*",
							operand: 3
						}
					}
				},
			]
		},
		arithmetic_two_params: {
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return str2array(v, "number"); });
				for(var I1_index in Is) {
					for(var I2_index in Is) {
						if(I1_index==I2_index) continue;
						var I1 = Is[I1_index];	var I2 = Is[I2_index];
						try {
							var I1_values = _.map(I1, function(iv){ return str2array(iv, "number"); });
							var I2_values = _.map(I2, function(iv){ return str2array(iv, "number"); });
						} catch(e){
							continue;
						}
						if(!isSameShape(I1_values, I2_values) || !isSameShape(I2_values, oValues)) continue;
						// TRY OPERATIONS
						var flat_I1_values = _.flatten(I1_values);
						var flat_I2_values = _.flatten(I2_values);
						var flat_output_values = _.flatten(oValues);
						for (var iArith in CrowdPlanner.helper_arithmetic) {
							// SKIP FOR I1 + I2 where I2 < I1:  TO REDUCE REDUNDANT PROGRAMS
							if(I1_index>I2_index && (iArith=="+" || iArith=="*")) continue;
							var arith_func = CrowdPlanner.helper_arithmetic[iArith].execute;
							var simulated_output = _.map(flat_I1_values, function(vvv,i) {
								return arith_func(flat_I1_values[i],flat_I2_values[i]);
							});
							if(isSameArray(flat_output_values, simulated_output)) {
								Ps.push({
									type:"arithmetic_two_params",
									param: {
										operator: iArith,
										operand_A: I1_index,
										operand_B: I2_index,
										inputIndex: ""+I1_index+","+I2_index
									}
								});
							}
						}
					}
				}
				return Ps;
			},
			execute:function(previousSteps, P) {
				var I1 = previousSteps[P.param.operand_A];
				var I2 = previousSteps[P.param.operand_B];
				var I1_val = _.map(I1, function(iv){ return str2array(iv, "number"); });
				var I2_val = _.map(I2, function(iv){ return str2array(iv, "number"); });
				var arith_func = CrowdPlanner.helper_arithmetic[P.param.operator].execute;
				return _.map(I1_val, function(v,i){return arith_func(I1_val[i],I2_val[i]); });
			},
			unitTests: [
				{	inputs:[
						[],
						["0,3,-3", "5,9"], 
						["3,-3", "5,9"], 
						["1,2,1", "3,5"]
					],
					output: [ "-1,1,-4", "2,4"],
					program: {
						type:"arithmetic_two_params",
						param: {
							operator: "-",
							operand_A: 1,
							operand_B: 3,
							inputIndex: ""+1+","+3
						}
					}
				},
				{	inputs:[
						[],
						["0", "9", "3" ], 
						["5", "1", "2" ],
						[],
					],
					output: [ "5", "10", "5" ],
					program: {
						type:"arithmetic_two_params",
						param: {
							operator: "+",
							operand_A: 1,
							operand_B: 2,
							inputIndex: ""+1+","+2
						}
					}
				},
				{	inputs:[
						["3", "9" ], 
						["1", "3" ]
					],
					output: [ "3", "3" ],
					program: {
						type:"arithmetic_two_params",
						param: {
							operator: "/",
							operand_A: 0,
							operand_B: 1,
							inputIndex: ""+0+","+1
						}
					}
				},
				{	inputs:[
						["3", "9" ], 
						["1", "3" ]
					],
					output: [ "3", "27" ],
					program: {
						type:"arithmetic_two_params",
						param: {
							operator: "*",
							operand_A: 0,
							operand_B: 1,
							inputIndex: ""+0+","+1
						}
					}
				},
			]
		},
		filter: {
			generate: function(Is, O) {
				var Ps = [];
				var oValues = _.map(O, function(v){return str2array(v); });
				if(Is.length<2) return [];
				for(var idxI=0; idxI<Is.length; idxI++) {
					for(var idxPred=0; idxPred<Is.length; idxPred++) {
						if(idxI==idxPred) continue;
						var I = Is[idxI];
						var Pred = Is[idxPred];
						var I_values = _.map(I, function(iv){ return str2array(iv); });
						try {
							var Pred_values = _.map(Pred, function(kv){ return str2array(kv,"boolean"); });	
						} catch(e) {
							continue;
						}
						if(!isPredicateArray(Pred_values)) continue; 
						if(!isSameShape(I_values, Pred_values)) continue;
						// GET TRUE FILTERED I_values
						var true_filtered = _.map(I_values, function(values, value_i){
							return _.filter(values, function(val, value_j){
								return Pred_values[value_i][value_j];
							});
						});
						var true_filtered_inverse = _.map(I_values, function(values, value_i){
							return _.filter(values, function(val, value_j){
								return !Pred_values[value_i][value_j];
							});
						});
						// CHECK IF TRUE FILTERED LIST MATCHES OUTPUT
						if(isSameArray(true_filtered, oValues)) {
							Ps.push({
								type:"filter",
								param: {
									source: idxI,
									pred: idxPred,
									inputIndex: ""+idxI+","+idxPred,
									inverse:false
								}
							});
						}
						if(isSameArray(true_filtered_inverse, oValues)) {
							Ps.push({
								type:"filter",
								param: {
									source: idxI,
									pred: idxPred,
									inputIndex: ""+idxI+","+idxPred,
									inverse:true
								}
							});
						}
					}
				}
				return Ps;
			},
			execute:function(previousSteps, P) {

			},
			unitTests: [
				{	inputs:[
						["ab, kde, defg", "defg, ac" ], 
						["true, false, true", "false, true" ]
					],
					output: [ "ab, defg", "ac"],
					program: {
						type:"filter",
						param: {
							source : 0,
							pred: 1,
							inputIndex: ""+0+","+1,
							inverse:false
						}
					}
				},
				{	inputs:[
						["abc", "de" ],
						["ab, kde, defg", "defg, ac" ], 
						["2,3,4", "4,2" ],
						["true,false,true", "true,true" ],
					],
					output: [ "ab, defg", "defg, ac"],
					program: {
						type:"filter",
						param: {
							source : 1,
							pred:3,
							inputIndex: ""+1+","+3,
							inverse:false
						}
					}
				}
			]
		},
		boolean_operation: {
			generate: function(Is, O) {
				var Ps = [];
				try{	var oValues = _.map(O, function(v){return str2array(v, "boolean"); });	
				} catch(e) {	return Ps;		}
				if(Is.length<2) return Ps;
				for(var I1_index in Is) {
					for(var I2_index in Is) {
						if(I1_index>=I2_index) continue;
						var I1 = Is[I1_index];	var I2 = Is[I2_index];
						try {
							var I1_values = _.map(I1, function(iv){ return str2array(iv, "boolean"); });
							var I2_values = _.map(I2, function(iv){ return str2array(iv, "boolean"); });
						} catch(e){
							continue;
						}
						if(!isSameShape(I1_values, I2_values) || !isSameShape(I2_values, oValues)) continue;
						var flat_I1_values = _.flatten(I1_values);
						var flat_I2_values = _.flatten(I2_values);
						var flat_output_values = _.flatten(oValues);
						for (var iCond in CrowdPlanner.helper_boolean_operators) {
							var cond_operator = CrowdPlanner.helper_boolean_operators[iCond];
							var simulated_output = _.map(flat_I1_values, function(vvv,i) {
								return cond_operator(flat_I1_values[i],flat_I2_values[i]);
							});
							if(isSameArray(flat_output_values, simulated_output)) {
								Ps.push({
									type:"boolean_operation",
									param: {
										operator: iCond,
										booleanA: I1_index,
										booleanB: I2_index,
										inputIndex: ""+I1_index+","+I2_index
									}
								});
							}
						}
					}
				}
				return Ps;
			},
			execute:function(previousSteps, P) {	},
			unitTests: [
				{	inputs:[
						["true,false,true", "true"], 
						["false,true,true", "false" ],
					],
					output: [ "false,false,true", "false"],
					program: {
						type:"boolean_operation",
						param: {
							booleanA : 0,
							booleanB : 1,
							inputIndex: ""+0+","+1,
							operator: "AND"
						}
					}
				},
				{	inputs:[
						[],
						["1,2,3"],
						["true,false,true", "true"], 
						["false,true,true", "false" ],
					],
					output: [ "true,true,true", "true"],
					program: {
						type:"boolean_operation",
						param: {
							booleanA : 2,
							booleanB : 3,
							inputIndex: ""+2+","+3,
							operator: "OR"
						}
					}
				}
			]
		},
		number_test: {
			generate: function(Is, O) {
				var Ps = [];
				try{
					var oValues = _.map(O, function(v){return str2array(v, "boolean"); });	
				} catch(e) {	
					return Ps;	
				}
				_.each(Is, function(I,I_index){
					try {
						var inputValues = _.map(I, function(iv){ return str2array(iv, "number"); });
					} catch(e){	return;	}
					if(!isSameShape(inputValues, oValues)) return;
					// TRYING DIFFERENT CONDITIONAL OPERATORS 
					var validConditionals = CrowdPlanner.findConditionals(inputValues, oValues);
					_.each(validConditionals, function(op){
						Ps.push({
							type: "number_test",
							param: {
								source: I_index,
								inputIndex: ""+I_index,
								operator: op[0],
								operand: op[1] 
							}
						});
					});
				});
				return Ps;
			},
			execute:function(previousSteps, P) {

			},
			unitTests: [
				{	inputs:[
						["ab, kde, defg", "defg, ac" ], 
						["2,3,4,5,6,7", "4,2" ],
					],
					output: [ "true,true,false,false,false,false", "false,true"],
					program: {
						type:"number_test",
						param: {
							source : 1,
							inputIndex: ""+1,
							operator : "<",
							operand: 4
						}
					}
				},
				{	inputs:[
						["abc", "de" ],
						["ab, kde, defg", "defg, ac" ], 
						["2,3,4,5,6,7", "4,2" ],
						["true,false,true", "true,true" ],
					],
					output: [ "false,true,false,false,true,false", "false,false"],
					program: {
						type:"number_test",
						param: {
							source : 2,
							inputIndex: ""+2,
							operator: "%",
							operand: 3
						}
					}
				},
				{	inputs:[
						["ab, kde, defg", "defg, ac" ], 
						["2,3,4,5,6,7", "4,2" ]
					],
					output: [ "false,true,false,true,false,true", "false,false"],
					program: {
						type:"number_test",
						param: {
							source : 1,
							inputIndex: ""+1,
							operator: "!%",
							operand: 2
						}
					}
				}
			]
		},
		string_test: {
			// contains.  
			generate: function(Is, O) {

			},
			execute:function(previousSteps, P) {

			}
		}
	},

	get_common_tokens : function(strList) {
		var list_of_tokens = _.map(strList, function(v){return CrowdPlanner.get_tokens(v); });
		return _.intersection.apply(this, list_of_tokens);
	},
	get_tokens : function(str) {
		var basic = ['','____end_of_line___'];
		var regex_split = /[,\.-:;=\s]/;
		var bag_of_words = _.without(str.split(regex_split), false, undefined, "");
		var bag_of_letters = _.unique(_.map(str, function(v){return v;}));
		var split_tokens = _.filter([',','\.','-',':',';',' '], function(t) { return str.indexOf(t)!=-1; });
		return _.union(basic,bag_of_words,bag_of_letters,split_tokens);
	},
	helper_conditional: function(op1, op2, operator) {
		if(operator=="<") return op1<op2;
		if(operator==">") return op1>op2;
		if(operator=="==") return op1==op2;
		if(operator=="%") return op1%op2==0;
		if(operator=="!%") return op1%op2!=0;
	},
	helper_boolean_operators: {
		"AND": function(b1,b2) { return b1 && b2;},
		"OR": function(b1,b2) { return b1 || b2;}
	},
	helper_arithmetic: {
		"+": {		
			execute:function(op1, op2) { return parseFloat(op1)+parseFloat(op2); }
		},
		"-": {		
			execute:function(op1, op2) { return parseFloat(op1)-parseFloat(op2); }
		},
		"*": {		
			execute:function(op1, op2) { return parseFloat(op1)*parseFloat(op2); }
		},
		"/": {		
		 	execute:function(op1, op2) { return parseFloat(op1)/parseFloat(op2); }
		},
		"%": {		
			execute:function(op1, op2) { return parseFloat(op1)%parseFloat(op2); }
		}
	},
	findConditionals: function(inList, outList) {
		// inList:  [  [1,2], [3,4,5] , ...]
		// outList: [  [true,false], [true,false,...], ...]
		// return.  ["<=", 5] or ["%!"]
		var formulas = [];
		var flatInputValues = _.flatten(inList);
		var flatOutputValues = _.flatten(outList); 
		var max_val = _.max(_.flatten([inList,outList]));
		var min_val = _.min(_.flatten([inList,outList]));
		var cand_operands = _.range(min_val*2, max_val*2);
		var cand_operands_for_remainder = _.range(2,11);
		var cand_operators = ["<",">","==","%","!%"];
		//
		for(var iCond in cand_operators) {
			var operator = cand_operators[iCond];
			var operands = (operator=="!%" || operator=="%")? cand_operands_for_remainder: cand_operands;
			for(var iOperand in operands) {
				var operand = operands[iOperand];
				if(_.every(flatOutputValues, function(out, i) {
					return CrowdPlanner.helper_conditional(flatInputValues[i], operand, operator) == out;
				})) {
					formulas.push([operator, operand]);
				}
			}
		} 
		return formulas;
	},
	findFormulaSingleParam: function(inList, outList) {
		// GENERATE CANDIDATE RANGE OF OPERANDS
		// inLIst and outList:  [ [1,2,3], ...   ]
		var formulas = [];
		var flatInputValues = _.flatten(inList);
		var flatOutputValues = _.flatten(outList); 
		var max_val = _.max(_.flatten([inList,outList]));
		var cand_operands = _.range(max_val*-2, max_val*2);
		// TRY COMBINATIONS OF OPEARTION AND OPERANDS
		for(var iAr in CrowdPlanner.helper_arithmetic) {
			var arithmeticFunc = CrowdPlanner.helper_arithmetic[iAr].execute;
			for(var iOperand in cand_operands) {
				var operand = cand_operands[iOperand];
				if(_.every(flatOutputValues, function(out, i) {
					return arithmeticFunc(flatInputValues[i],operand) == out;
				})) {
					formulas.push([iAr, operand]);
				}
			}
		}
		// EXCLUDE SOME REDUNDANT CASES
		formulas = _.filter(formulas, function(fr) {
			if (fr[0]=="+" && fr[1]<0) return false;
			if (fr[0]=="-" && fr[1]<0) return false;
			return true;
		})
		return formulas;
	}

};


/*  

* 스터디 상에서 프로그램을 실행하는 경우는 없다. 그래도 실행 가능하긴 해야함.  

Input+1
	Similar programs: Input [*,+,-,/,%] n, 
	* 중복 예시를 제공하는 경우는 여러 프로그램이 생성되었으니 예시를 더 달라는 피드백으로 반격
	* 실수로 input이랑 output이 안 맞는 경우가 있다.  그럴 때는 fail만 보여주자. 만들어야하는 프로그램을 컴퓨터가 미리 알고서 피드백을 준다는 설정은 말이 안됨.  

(Input+1)*2
	* 기본적으로 arithmetic은 1-step만 처리한다. 
	* 두 step에 대해서 사칙연산들은 전부 후보로 적용됨. 

(Input+1) * (Input-1)
	* Step을 늘려야하는지 Case를 늘려야하는지 몰라서 헤매는 경우가 있다. 
	* 각 스탭별로 피드백을 줌. (Input제외; Step이랑 Output만)
		1. 현재 스텝에 해당하는 P를 찾을 수가 없다면? --> No program is found for this step. You can try different examples or add a step above.  
		2. 현재 스탭에 해당하는 P가 여러개라면? --> Multiple programs that calculate examples of the step are found. To teach a unique program, you can add more cases or modify current examples.
		3. Unique한 P를 찾았다면? --> A unique program that calculate exampels of the step is found. 
		4. Exception이 발생했다면? 
			Value대신 formula나 description을 적은 경우 --> Text로 처리할 것이기 때문에 방법이 없음. (1)로. 

Sort Input in ascending order
	* 이건 괜찮은 예시

Count
	* Text를 다루는 첫 예시. 
	* 주어진 예시만으로 끝나는 문제라 의미가 없음.
	*** Text extraction으로 바꾸자. 뒤에 나오는 Jane:Art:87 같은 거 써서. 

Count without space or numbers
	Similar programs: Count, Count without space, Count without numbers
	* 이거 task로 좋음.  차라리 text replace를 가르쳐주고, 실제 task로 이걸 쓰자.  함정에 빠뜨리기 위해서는 아예 예시를 주지 않거나, number만 포함하는 경우로 주자. 아니면 task를 count alphabets only로 하덩가. 

Filter text by length
	* 이것도 task로 옮기자. 
	* 대신 true/false 만드는 Predicate을 연습시키자.  

Nested-list
	* okay.

--- 실제 태스크
Art 스코어 min,max만 뽑기 
	* 
(TBD)




	






*/