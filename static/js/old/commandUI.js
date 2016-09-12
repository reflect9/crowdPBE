Vespy.CommandUI = function(target, grid) {
	this.top=220;  this.left=310;
	this.target = target;
	this.grid = grid;
	this.ui_el = $("<div id='commandUI'>\
		<div class='header_panel'>\
			<div class='operation_info'>\
				<div class='operation_title'></div>\
				<div class='operation_description'></div>\
				<i class='fa fa-trash-o reset_operation'></i>\
			</div>\
			<div class='header_panel_tools_burger'><i class='fa fa-bars'></i></div>\
			<div class='header_panel_tools'>\
				<button class='simple duplicate_button'>duplicate</button> \
				<button class='simple copy_button'>copy</button>\
				<button class='simple share_button'>share_across_tabs</button>\
				<button class='simple clear_data_button'>clear data</button>\
				<label>INSERT</label><button class='simple insert_left_button'>left</button>\
				<button class='simple insert_above_button'>above</button> \
				<label>DELETE</label><button class='simple delete_row_button'>row</button>\
				<button class='simple delete_column_button'>column</button> \
			</div>\
		</div>\
		<div class='data_panel'>\
			<div class='input_data'>\
				<div class='input_nodes_container'></div>\
				<div class='input_nodes_tools'>\
					<i class='fa fa-plus add_input_node_button'></i>\
					<!--<i class='fa fa-play-circle-o operation_execute_button'></i>-->\
				</div>\
			</div>\
			<div class='output_data'>\
				<div class='output_data_table'>\
					<ul class='data_ul'></ul>\
				</div>\
				<div class='output_data_tools' floating_buttons_at_the_bottom'>\
					<div class='output_data_info'><label>VALUES</label></div>\
					<div class='wrapper_tools'>\
						<i class='fa fa-trash-o clear_data_button'></i>\
					</div>\
				</div>\
				<div class='output_type_and_number'></div>\
			</div>\
		</div>\
		<div class='op_panel'>\
			<div class='basic_op'></div>\
			<div class='suggested_op'></div>\
		</div>\
		</div>");

	$(this.ui_el).find(".header_panel_tools_burger").click(function() {
		console.log("burger");
		$("#commandUI").find(".header_panel_tools").toggle("slide", {direction:"right"}, 300);
	});
	//  CREATING TOOLBOX IN THE op_panel 
	this.toolbox = new Vespy.Toolbox($(this.ui_el).find(".op_panel"), Vespy.planner.get_all_operations());

	// $(ui_el).find(".operation_execute_button").click(function() {
	// 	// BEFORE EXECUTING, UPDATE CHANGED PARAMETERS
	// 	var node = Vespy.grid.get_current_node();
	// 	//Vespy.page.run_node(node);
	// 	Vespy.page.run_triggered_nodes([node]);
	// 	Vespy.grid.redraw();
	// 	Vespy.commandUI.grid.redraw();
	// });
	$(this.ui_el).find(".reset_operation").click(function() {
		var node = Vespy.grid.get_current_node();
		node.P=undefined;
		Vespy.grid.redraw();
	});
	$(this.ui_el).find(".duplicate_button").click(function() {
		Vespy.page.duplicate_node();
		Vespy.grid.redraw();
	});
	$(this.ui_el).find(".copy_button").click(function() {
		Vespy.page.clone_node();
	});
	$(this.ui_el).find(".share_button").click(function() {
		Vespy.page.share_node_across_tabs();
	});
	$(this.ui_el).find(".insert_left_button").click(function() {
		var node = Vespy.grid.get_current_node();
		var col = node.position[1];
		Vespy.page.insert_column(col);
		Vespy.grid.redraw();
	});
	$(this.ui_el).find(".insert_above_button").click(function() {
		var node = Vespy.grid.get_current_node();
		var row = node.position[0];
		Vespy.page.insert_row(row);
		Vespy.grid.redraw();
	});
	$(this.ui_el).find(".delete_row_button").click(function() {
		var node = Vespy.grid.get_current_node();
		var row = node.position[0];
		Vespy.page.delete_row(row);
		Vespy.grid.redraw();
	});
	$(this.ui_el).find(".delete_column_button").click(function() {
		var node = Vespy.grid.get_current_node();
		var col = node.position[1];
		Vespy.page.delete_column(col);
		Vespy.grid.redraw();
	});
	$(this.ui_el).find(".add_input_node_button").click(function() {
		var node = Vespy.grid.get_current_node();
		node.I.push("");
		Vespy.grid.redraw();
		Vespy.commandUI.redraw();
	});
	$(this.ui_el).find(".data_tools").find("i.fa-trash-o").click(function() {	Vespy.empty();	});
	$(this.ui_el).find(".clear_data_button").click(function(e){Vespy.empty(Vespy.el_to_obj(e.target));});

	$(this.target).replaceWith(this.ui_el);	
	$(this.ui_el).css({
		'visibility':"visible",
		"top":this.top + "px",
		"left":this.left + "px"
	});
	$(this.ui_el).hover(function() {
		// $("body").css("overflow","hidden");
	},function() {
		// $("body").css("overflow","auto");
	});
	$(this.ui_el).draggable({handle: ".header_panel",
		cancel: "span.param",
		start: function() {
			Vespy.commandUI.turn_inspector(false);
		},
		stop: $.proxy(function(event, ui) {
			this.top = ui.offset.top - $(window).scrollTop();;
			this.left = ui.offset.left - $(window).scrollLeft();;
			this.turn_inspector(true);
			console.log(ui.offset);
		},this)
	});

};

// FOR THE CURRENTLY SELECTED NODE, UPDATE OPERATION, INPUT NODES, DATATABLE, and OPERATION panels
Vespy.CommandUI.prototype.redraw = function() {
	var node = this.grid.get_current_node();
	this.updateCurrentOperation(node);
	this.updateSuggestedOperation(node);
	this.updateInputNodes(node);
	this.renderDataTable(node.V, $(this.ui_el).find(".output_data").find("ul.data_ul"));
	if(node && node.P && node.P.kind) {
		$(this.ui_el).attr("operation_kind",node.P.kind);				
	} else {
		$(this.ui_el).removeAttr("operation_kind");				
	}
	$(this.ui_el).removeClass("hidden");
};
Vespy.CommandUI.prototype.hide = function() {
	$(this.ui_el).addClass("hidden");
};
Vespy.CommandUI.prototype.visible = function() {
	return !$(this.ui_el).hasClass("hidden");
};
Vespy.CommandUI.prototype.execute = function() {
	var node = Vespy.grid.get_current_node();
	Vespy.page.run_triggered_nodes([node]);
	Vespy.grid.redraw();
};
Vespy.CommandUI.prototype.updateAllParameters = function() {
	var params = $(this.ui_el).find("span.param");
	var op_desc_el = $(this.ui_el).find(".operation_description");
	var node = this.grid.get_current_node();
	if(typeof node =="undefined") { 
		console.debug("Node is not selected."); 
		return; 
	} else {
		$.each(params, $.proxy(function(i,param){
			var prevValue = $(param).attr("previousValue");
			if(typeof  prevValue !== typeof undefined && prevValue != false 
				&& prevValue != $(param).text()) {
				this.node.P.param[$(param).attr('paramKey')]=$(param).text();
				var key = $(param).attr('paramKey');
				var value = $(param).text();
				// Vespy.log.add({type:'set_operation_parameter',key:key,value:value, node:serialize_node(this.node,false)});
			}
		},{node:node}));
	}
	//Vespy.grid.redraw();
	//Vespy.commandUI.highlightExecuteButton();
	$(op_desc_el).find(".param_option_list").remove();
};
Vespy.CommandUI.prototype.highlightExecuteButton = function() {
	$(this.ui_el).find(".run_operation").addClass("ready");
};
Vespy.CommandUI.prototype.updateInputNodes = function(node) {
	var input_container = $(this.ui_el).find(".input_nodes_container");	 
	var input_el_list = this.renderInputNode(node);
	$(input_container).empty().append(input_el_list);
};
Vespy.CommandUI.prototype.updateCurrentOperation = function(node) {
	var operation_info = $("#commandUI").find(".operation_info");	 
	Vespy.commandUI.renderOperationInfo(node, operation_info);
};
Vespy.CommandUI.prototype.updateSuggestedOperation = function(node) {
		// var operation_container = $("#commandUI").find("#operation_container");  	// main command UI
		// var task_container = $("#commandUI").find("#task_container");  	// main command UI
		// $(operation_container).empty();   $(task_container).empty();

		// 0. infer tasks and operations
		var Is = _.without(_.map(node.I, function(input_id) {
			return Vespy.page.get_node_by_id(input_id, node);
		}));
		var taskSuggestions = []; var opSuggestions=[]; var opRest = [];
		// infer tasks matching with the given input and output
		if(node.V && node.V.length>0) {
			taskSuggestions = (node.V && node.V.length>0)? Vespy.planner.plan(Is, node) : [];	
		} 
		// suggest applicable operations
		opSuggestions = Vespy.planner.find_applicable_operations(Is);
		var operation_types = _.map(opSuggestions, function(op){return op.type; });

		// The rest of the operations
		var operation_all = _.map(Vespy.planner.get_all_operations(), function(op) {
			if(operation_types.indexOf(op.type)!==-1) op.applicable=true;
			else op.applicable=false;
			return op;
		});
		this.toolbox.redraw(_.union(taskSuggestions, operation_all));


		/*
		// 1. show taskSuggestions 
		if(taskSuggestions.length>0) {
			_.each(taskSuggestions, function(sn, sni) {
				var nodeSet = Vespy.commandUI.makeSuggestedTaskButton(sn);
				$(task_container).append(nodeSet);
			});
		} 
		// show applicable opSuggestions
		if(opSuggestions.length>0) {
			_.each(opSuggestions, function(op, opi)  {
				var commandButton = Vespy.commandUI.makeSuggestedOperationButton(op);
				if(node && node.P && node.P.type==c.type) {
					// if the command is curreltly selected
					$(commandButton).attr('selected',true);
				}
				$(operation_container).append(commandButton);
			});
		}
		var operation_types = _.map(opSuggestions, function(op){return op.type; });
		var rest_op = _.filter(Vespy.planner.get_all_operations(), function(op) {
			return operation_types.indexOf(op.type)==-1;
		});
		_.each(rest_op, function(op, opi) {
			var commandButton = Vespy.commandUI.makeSuggestedOperationButton(op, true);
			$(operation_container).append(commandButton);
		});
*/
};
	
	// makeSuggestedTaskButton: function(_nodes) {
	// 	var el = $("<div class='nodes'></div>"); 
	// 	var nodes = $.makeArray(_nodes);
	// 	_.each(nodes, function(n) {
	// 		$("<div class='command'>"+ n.P.type +"</div>").appendTo(el);
	// 	});
	// 	$(el).click($.proxy(function() {
	// 		Vespy.page.insert(this, Vespy.grid.get_current_node());
	// 		Vespy.run_node(this[0]);
	// 	},nodes));
	// 	return el;
	// },
	// makeSuggestedOperationButton: function(command, dimmed) {
	// 	var el = $("<div class='command'>\
	// 		<div class='com_icon'></div>\
	// 		<div class='com_title'>"+ command.type +"</div>\
	// 		</div>\
	// 		"); 
	// 	if(dimmed) $(el).attr('dimmed','yes');
	// 	$(el).click($.proxy(function() {
	// 		var n = Vespy.grid.get_current_node();
	// 		n.P = this;
	// 		Vespy.run_node(n);
	// 		Vespy.grid.redraw();
	// 	},command));
	// 	return el;
	// },


// UPDATING PANELS FOR THE INPUT NODES
Vespy.CommandUI.prototype.renderInputNode = function(node) {
	var input_nodes_el = [];
	//var width_per_node = Math.floor(100/Math.max(node.I.length, 2))-1;
	for(var i=0; i<node.I.length; i++) {
		try{
			var inputNode = this.grid.page.get_node_by_id(node.I[i], node);
			var inputNode_el = $("<div class='input_node_info'>\
					<div class='input_node_header'>\
						<div class='input_node_index_and_id'>\
							<label><span class='input'>input</span>"+(i+1)+" </label><input type='text' class='input_node_id' inputNodeIdx='"+i+"' value='"+node.I[i]+"'/>\
						</div>\
						<div class='wrapper_tools'>\
							<a class='pick_button' inputNodeIdx='"+i+"'><i class='fa fa-crosshairs'></i></a>\
							<a class='delete_button' inputNodeIdx='"+i+"'><i class='fa fa-trash-o'></i></a>\
						</div>\
					</div>\
					<div class='input_node_data_container'>\
						<ul class='data_ul'></ul>\
					</div>\
					<div class='input_node_data_type_and_number'>\
						<span><b>"+((inputNode.V)?inputNode.V.length:0)+"</b> "+getValueType(inputNode.V)+"\
					</div>\
				</div>");

			$(inputNode_el).find("input.input_node_id").change(function() {
				var i = $(this).attr('inputNodeIdx');
				var newInputID = $(this).val();
				(Vespy.grid.get_current_node()).I[i]=newInputID;
				Vespy.grid.redraw();
				Vespy.commandUI.redraw();
			});
			$(inputNode_el).find("a.pick_button").click($.proxy(function() {
				this.grid.node_select_modal_on(this.i);
			},{i:i, grid:this.grid}));
			$(inputNode_el).find("a.delete_button").click($.proxy(function() {
				this.node.I.splice(this.i,1);
				this.grid.redraw();
				Vespy.commandUI.redraw();
			},{node:node, i:i, grid:this.grid}));
			// render data in V
			var data_ul_el = $(inputNode_el).find("ul.data_ul").empty(); 
			if(inputNode.V) {
				this.renderInputDataTable(inputNode.V, data_ul_el);		
			} 
			// $(inputNode_el).css("width",width_per_node+"px");
			input_nodes_el.push(inputNode_el);
		} catch(e) {	console.error(e.stack); 	continue;	}
	}
	return input_nodes_el;
};
Vespy.CommandUI.prototype.renderOperationInfo = function(node, _container_el) {
	var container_el = (_container_el)?_container_el:$("<div></div>").get(0);
	var P = node.P;
	var title, description;
	if(typeof P==='undefined') {
		description="No operation is chosen";
		// description="Node instructions:\
		// 		<div class='small'>1) Optionally enter “VALUES” to see suggested actions.</div>\
		// 		<div class='small'>2) Select action or operation to apply to nodeSelect an operation in the list or set output data that you want.</div></span>";
	} else {
		title = (P.type)? P.type.toUpperCase().replace("_"," "): "Unknown";
		description= this.renderDescription(node);
	}
	$(container_el).find(".operation_description").empty()	
		.append(description);
	if(node.P) {
		$(container_el).find(".operation_title").empty()
			.attr("kind",node.P.kind)
			.append("<i class='fa fa-"+node.P.icon+" fa-lg'></i>")
			.append(title);	
		$("<div class='run_operation' title='Run current operation'>\
				<span class='run_op_inst'>Update Values</span>\
				<i class='fa fa-play-circle'></i>\
			</div>")
			.click($.proxy(function() {
				this.updateAllParameters();
				this.execute();
			},this))
			.appendTo((container_el).find(".operation_description"));
		$(this.ui_el).attr("operation_kind",node.P.kind);	
	} else {
		$(container_el).find(".operation_title").empty();
		$(this.ui_el).removeAttr("operation_kind");				
	}
	return $(container_el).get(0);
};
Vespy.CommandUI.prototype.renderDescription = function(node) {
	if(!node || typeof node.P==='undefined' || typeof node.P.description==='undefined') 
		return "No Description is available"
	var desc = node.P.description;
	var desc_el = desc;
	var params_raw = desc.match(/\[\w+\]/g);
	if (params_raw===null) return desc;
	_.each(params_raw, function(praw) { // replace [key] to span element text
		var key = praw.replace(/\[|\]/g,'');
		if(typeof node.P.param==='undefined' || !(key in node.P.param)) return;
		var value = node.P.param[key];
		desc_el = desc_el.replace(praw,"<span contenteditable='true' class='param' paramKey='"+key+"'>"+value+"</span>");
	});
	desc_el = $("<span class='description'>"+desc_el+"</span>");	// convert to jQuery element
	$.each($(desc_el).find("span.param"), function(i, span) {
		if($(span).text().match(/\s*/g)[0]==$(span).text()) 
			$(span).css({
				'display':'inline-block',
				'vertical-align':'bottom'
			});
	});  
	// SETTING PARAMETER INTERACTION (e.g. Input, etc))
	$(desc_el).find("span.param")
		.focus($.proxy(function(e) {
			// restore real value
			$(e.target).text($(e.target).attr('paramValue'));
			// when parameter is focused, remember previous value
			$(e.target).attr("previousValue",$(e.target).text());
			var op_desc_el = $(e.target).closest(".operation_description");
			// create selectable options
			param_options = this.commandUI.renderParamOptions(this.node,$(e.target).attr("paramKey"));
			var pos = $(e.target).position();
			$(param_options).css({top:pos.top+28, left:pos.left});
			$(op_desc_el).append(param_options);
		},{node:node, commandUI:this}))
		.keypress($.proxy(function(e) {
			if ( event.which == 13 ) {
				var op_desc_el = $(e.target).closest(".operation_description");
				if($(e.target).attr("previousValue") != $(e.target).text()) {
					var node = this.grid.get_current_node();
					var key = $(e.target).attr('paramKey');
					var value = $(e.target).text();
					node.P.param[key]=value;
					// // Vespy.log.add({type:'set_operation_parameter',key:key,value:value, node:serialize_node(node,false)});
					this.grid.redraw();
					Vespy.commandUI.redraw();
					this.highlightExecuteButton();
				}
				$(op_desc_el).find(".param_option_list").remove();
				event.preventDefault();
			}
		},this))
		.blur($.proxy(function(e) {
			var op_desc_el = $(e.target).closest(".operation_description");
			if($(e.target).attr("previousValue") != $(e.target).text()) {
				var node = this.grid.get_current_node();
				node.P.param[$(e.target).attr('paramKey')]=$(e.target).text();
				var key = $(e.target).attr('paramKey');
				var value = $(e.target).text()
				// Vespy.log.add({type:'set_operation_parameter',key:key,value:value, node:serialize_node(node,false)});
				this.grid.redraw();
				Vespy.commandUI.redraw();
				this.highlightExecuteButton();
			}
			$(op_desc_el).find(".param_option_list").remove();
			//Vespy.commandUI.grid.redraw();
		},this));
	return desc_el;
};
Vespy.CommandUI.prototype.renderParamOptions = function(node, paramKey) {
	var options = Vespy.planner.get_options(node.P.type, paramKey);
	if(!options || !_.isArray(options) || options.length==0) return;
	var el_option_list = $("<div class='param_option_list'>\
			<ul></ul>\
		</div>"); 
	var ul = $(el_option_list).find("ul");
	for(var i in options) {
		var op = $("<li class='param_option_item'>"+options[i]+"</li>")
		.click($.proxy(function(e) {
			this.node.P.param[this.paramKey]= $(e.target).text();
			this.node.P.param[this.paramKey]= $(e.target).text();
			// Vespy.log.add({type:'set_operation_parameter',key:this.paramKey,value:$(e.target).text(), node:serialize_node(this.node,false)});
			//Vespy.page.run_node(this.node);
			this.commandUI.redraw();
			this.commandUI.grid.redraw();
			this.commandUI.highlightExecuteButton();
			//Vespy.page.run_triggered_nodes([node]);
			//Vespy.commandUI.grid.redraw();  
		},{node:node, paramKey:paramKey, commandUI:this}))
		.appendTo(ul);
	}
	return el_option_list;
	
};
Vespy.CommandUI.prototype.renderInputDataTable = function(V, target_ul) {
	$(target_ul).empty();
	for(i in V) {
		var v = V[i]; 	var idx_to_show = parseInt(i)+1;
		var entryEl = $("<li data_index='"+i+"'></li>");
		if(isDom(v)) {
			// creating each attribute value
			var attr_dict = get_attr_dict(v);  // get_attr_dict returns simplified attr->value object
			_.each(attr_dict, $.proxy(function(value,key) {
				var attr_el = $("	<div class='attr'>\
										<span class='attr_key'>"+ key +":\
										<span class='attr_value' attr_key='"+key+"'>"+value+"</span>\
										<i class='fa fa-sign-out copy_attribute'></i></span>\
									</div>");
				// when attribute value is clicked, the value adds to the current node data
				$(attr_el).click($.proxy(function() {
					this._this.addData(this.value);
				},{_this:this._this, v:this.v, value:value})).appendTo(entryEl);
			},{_this:this, v:v}));	
		} else {	// WHEN THE DATA is NOT DOM
			$(entryEl).append("	<div class='attr'><span class='attr_value'>"+v+"</span></div>");
		}
		// ADD COPY BUTTON
		$("<i class='fa fa-sign-out copy_object'></i>").click($.proxy(function() {
			this._this.addData(this.v);
			// Vespy.log.add({type:'copy_node_value_from_input',value:serialize_values([this.v])});
		},{_this:this, v:v})).appendTo(entryEl);
		$(target_ul).append(entryEl);
	}
};
Vespy.CommandUI.prototype.renderDataTable = function(V, target_ul) {
	$(target_ul).empty();
	$(target_ul).parents(".output_data").find(".output_type_and_number")
		.empty()
		.append("<span><b>"+((V)?V.length:0)+"</b> "+getValueType(V)+"</span>");
	for(i in V) {	// render every data
		var v = V[i]; 	var idx_to_show = parseInt(i)+1;
		var entryEl = $("<li data_index='"+i+"'></li>"); 
		if(isDom(v)) {
			$("<div class='tag'>&lt;"+$(v).prop("tagName")+"&gt;</div>")
			.draggable({
				revert: false, // when not dropped, the item will revert back to its initial position
				helper: "clone",
				appendTo: "#pg",
				containment: "DOM",
				start: $.proxy(function(event,ui) {
					this.turn_inspector(false);
					Vespy.attaching_element = this.v;
					var target_elements = $(Vespy.documentBody).find("> *").not("#pg").find("*").addBack();
					// DROPPABLE START
					$(target_elements).droppable({
						accept:"div.tag",
						addClasses:false,
						greedy:true,
						over: function(event, ui) {
							//$(event.target).addClass("drop-hover");
						},
						drop: $.proxy(function(event, ui) {
							//$(event.target).css("color","blue");
							pos = {x:event.clientX,  y:event.clientY};
							this.renderAttacher(event.target, pos);
						},this)
					});
					// DROPPABLE END
				},this),
				stop: function(event,ui) {
					//var target_elements = $(Vespy.documentBody).find("> *").not("#pg");
					//$(Vespy.documentBody).find(".drop-hover").removeClass("drop-hover");
				},
			}).appendTo(entryEl);
			var attr_dict = get_attr_dict(v);  // get_attr_dict returns simplified attr->value object
			_.each(attr_dict, function(value,key) {
				var attr_el = $("	<div class='attr'>\
										<span class='attr_key'>"+ key +":\
										<span class='attr_value' contenteditable='true' attr_key='"+key+"'>"+value+"</span>\
									</div>").appendTo(entryEl);
			});	
		} else 	// WHEN THE DATA is NOT DOM
			$(entryEl).append("	<div class='attr'><span class='attr_value' contenteditable='true'>"+v+"</span></div>");
		$(entryEl).find("span.attr_value").focus(function() {
			$(this).attr("previousValue",$(this).text());
		})
		.keypress($.proxy(function(e) {
			if ( event.which == 13 ) {
				var node = _this.grid.get_current_node();
				var new_value = $(e.target).text();
				var pos = parseInt($(this).closest("li").attr("data_index"));
				if($(this).attr('attr_key')) {  // when edited value is element attribute
					var attr_key = $(this).attr('attr_key');
					var attr_func = Vespy.planner.attr_func(attr_key);
					if(attr_func==false) return;
					var attr_setter = attr_func['setter'];
					attr_setter(node.V[pos], new_value); 
				} else { // when edited object is just value
					node.V[pos] = txt2var(new_value);
				}
				// Vespy.log.add({type:'edit_node_value',value:serialize_values(node.V), node:Vespy.Node.serialize(node,false)});    
				//Vespy.commandUI.renderDataTable(node.V, $("#commandUI").find(".output_data").find("ul.data_ul"));
				_this.grid.redraw();
				_this.updateSuggestedOperation(node);
				event.preventDefault();
			}
		},this))
		.blur($.proxy(function() {   //blahblah
			if($(this).attr("previousValue") != $(this).text()) {
				var node = _this.grid.get_current_node();
				var new_value = $(this).text();
				var pos = parseInt($(this).closest("li").attr("data_index"));
				if($(this).attr('attr_key')) {  // when edited value is element attribute
					var attr_key = $(this).attr('attr_key');
					var attr_func = Vespy.planner.attr_func(attr_key);
					if(attr_func==false) return;
					var attr_setter = attr_func['setter'];
					attr_setter(node.V[pos], new_value); 
				} else { // when edited object is just value
					node.V[pos] = txt2var(new_value);
				}
				// Vespy.log.add({type:'edit_node_value',value:serialize_values(node.V), node:Vespy.Node.serialize(node,false)});    
				//Vespy.commandUI.renderDataTable(node.V, $("#commandUI").find(".output_data").find("ul.data_ul"));
				_this.grid.redraw();
				_this.updateSuggestedOperation(node);
			}
		},{_this:this}));
		// create trash and other tool buttons
		var data_edit_buttons = $("<div class='data_edit_buttons'></div>")
			.appendTo(entryEl);
		$(entryEl).hover(function(){ $(this).find(".data_edit_buttons").show();}, function(){$(this).find(".data_edit_buttons").hide();});			
		
		// DELETE BUTTON BEHAVIOR OF EACH DATA ITEM
		$("<a class='delete_button'><i class='fa fa-trash-o'></i></button>").click($.proxy(function(e) {
			var data_index = $(e.target).parents("li").attr("data_index");
			var node = this.grid.get_current_node();
			node.V.splice(data_index,1);
			this.grid.redraw();
			this.redraw();
		},this)).appendTo(data_edit_buttons);
		$(target_ul).append(entryEl);
	}
	var li_new_data = $("<li></li>");
	// INPUT BOX FOR NEW VALUES
	$("<input type='text' class='new_data_input' placeholder='Type to add a new value.'/>")
	.change($.proxy(function(e){
		var newValue = $(e.target).val();
		this.addData(newValue);
		$(e.target).val("");
		$("#commandUI").find("input.new_data_input").focus();
		// Vespy.log.add({type:'add_node_value',value:newValue});
	},this)).appendTo(li_new_data);
	$(target_ul).append(li_new_data);	
};
// ATTACHER FUNCTIONALITY
// DRAG AND DROP FOR ATTACHING ELEMENT INTO TEMPLATE PAGE
Vespy.CommandUI.prototype.renderAttacher = function(target, pos) {
	var el = Vespy.attaching_element;
	if(el===undefined || target===undefined) return;
	$("div.dialog_attach").remove();
	$("div.tandem_backdrop").remove();
	if(Vespy.sbox) { 	Vespy.sbox.hide();	Vespy.sbox.destroy();	}
	if(Vespy.attaching_target_box) {		Vespy.attaching_target_box.hide();	Vespy.attaching_target_box.destroy();	}
	var target_txt = ($(target).text()).replace(/ +(?= )/g,'').substring(0,30);
	var backdrop = $("<div class='tandem_backdrop'></div>")
		.click($.proxy(function() { _this.removeAttacher(); },{_this:this}))
		.appendTo(Vespy.documentBody);
	var dialog = $("<div class='dialog_attach'>\
			<div class='parents_list'></div>\
			<div>Attach <span class='el'>&lt;"+$(el).prop("tagName")+"&gt;</span> to \
			<span class='target'>&lt;"+$(target).prop("tagName")+"&gt;"+target_txt+"</span></div>\
			<button type='button' role='before'>before</button>\
			<div class='target_el_border'><button type='button' role='within-front'>front</button>\
			...<button type='button' role='within-back'>back</button></div>\
			<button type='button' role='after'>after</button>\
		</div>");
	var parents_el = $(dialog).find(".parents_list");
	Vespy.attaching_target_box = new Vespy.SelectionBox(3, '#02aff0');
	Vespy.attaching_target_box.highlight(target);
	_.each($($(target).parentsUntil('html').get().reverse()), function(p) {
		$("<span>"+$(p).prop("tagName")+"&gt; </span>").click($.proxy(function() {
			Vespy.commandUI.renderAttacher(this.p, this.pos);
			//Vespy.dataUI.create(this.p, pos);
		},{p:p, pos:pos}))
		.hover($.proxy(function(){
			Vespy.sbox = new Vespy.SelectionBox(1, '#02aff0');
			Vespy.sbox.highlight(this.p);
		},{p:p}),function(){
			if(Vespy.sbox) {
				Vespy.sbox.hide();
				Vespy.sbox.destroy();	
			}
		})
		.appendTo(parents_el);
	},this);
	$(dialog).find("button").click($.proxy(function(e) {
		Vespy.commandUI.attachElement(this.target, this.el, $(e.target).attr('role'));
		Vespy.commandUI.removeAttacher();
	},this));
	$(dialog).css("top", pos.y + $(window).scrollTop());
	$(dialog).css("left", pos.x + $(window).scrollLeft());
	$(Vespy.documentBody).append(dialog).show('fast');
},
Vespy.CommandUI.prototype.removeAttacher = function() {
	$(".tandem_backdrop").remove();
	$(".dialog_attach").remove();
	if(Vespy.sbox) { 	Vespy.sbox.hide();	Vespy.sbox.destroy();	}
	if(Vespy.attaching_target_box) {		Vespy.attaching_target_box.hide();	Vespy.attaching_target_box.destroy();	}
	Vespy.attaching_element = undefined;
	this.turn_inspector(true);
};
Vespy.CommandUI.prototype.attachElement = function(target, el, loc) {
	console.log(target, el, loc);
	var cloned_el = $.clone(el);
	$(cloned_el).addClass("dragged_element");
	if(loc=='before') $(target).before(cloned_el);
	if(loc=='after') $(target).after(cloned_el);
	if(loc=='within-front') $(target).prepend(cloned_el);
	if(loc=='within-back') $(target).append(cloned_el);
	// now generate suggestion
	Vespy.history.put({type:'attach',el:el, target:target, loc:loc});
	Vespy.history.infer();
};
Vespy.CommandUI.prototype.addData = function(val, _pos, _node) {
	var node = (_node)? _node: Vespy.grid.get_current_node();
	var pos = (typeof _pos!=='undefined')? pos: node.V.length;  
	node.V.splice(pos, 0, txt2var(val));
	Vespy.commandUI.renderDataTable(node.V, $("#commandUI").find(".output_data").find("ul.data_ul"));
	this.grid.redraw();
	this.updateSuggestedOperation(node);
};
Vespy.CommandUI.prototype.removeData  = function(pos, _node) {
	var node = (_node)? _node: this.grid.get_current_node();
	node.V.splice(pos, 1);
	this.renderDataTable(node.V, $("#commandUI").find(".output_data").find("ul.data_ul"));
	this.updateSuggestedOperation(node);
};
Vespy.CommandUI.prototype.replaceData = function(val, pos, _node) {
	var node = (_node)? _node: this.grid.get_current_node();
	this.removeData(pos, node);
	this.addData(val, pos, node);
};
Vespy.CommandUI.prototype.remove = function() {
	$("#commandUI").remove();
	Vespy.solutionNodes=[];
};
Vespy.CommandUI.prototype.turn_inspector = function(mode){
	if(mode==undefined || mode==true) {
		Vespy.inspector.on(Vespy.dataUI.create);	
	} else if(mode==false) {
		Vespy.inspector.unhighlight_list();
		Vespy.inspector.off(Vespy.dataUI.remove);
	}
};
