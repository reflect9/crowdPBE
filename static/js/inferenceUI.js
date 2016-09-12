/*
	inferenceUI is a UI component that shows operations and plans suggested by the planner
*/
MixedVespy.InferenceUI = function(targetEl) {
	this.target = targetEl;
	this.nodes = [];
	this.tokenForPulling = 0;
	this.interval = undefined;
};

MixedVespy.InferenceUI.prototype.triggerPull =function() {
	this.tokenForPulling = 3; // WHEN ANY EVENT HAPPENS, IT RECHARGES 3 TOKENS FOR PULLING SUGGESTIONS. 
};

MixedVespy.InferenceUI.prototype.autoPull = function(boolean_on_off) {
	if(boolean_on_off){
		this.interval = setInterval($.proxy(function(){
			// if(this.tokenForPulling==0) return;
			// else  this.tokenForPulling--;
			console.log("autoPull");
			var node = MixedVespy.grid.get_current_node();
			// PULL FROM AGENT
			$.get("pull", $.proxy(function(data, status, xhr) {
				this.ui.nodes = JSON.parse(data);
				var suggestionPBD = MixedVespy.planner.generateFromDemo(node, MixedVespy.editor.getDemo());
				this.ui.nodes = _.union(this.ui.nodes, suggestionPBD);
				this.ui.redraw();
			},{ui:this}));
			// FROM DEMONSTRATION
			// var suggestionPBD = MixedVespy.planner.generateFromDemo(node, MixedVespy.editor.getDemo());
			// this.nodes = suggestionPBD;
			// OPERATION FROM CURRENT NODE
			// var suggestionPBE = MixedVespy.planner.generateFromCurrentNodeValue(node);
			// this.nodes = _.union(this.nodes, suggestionPBE);
			// insertArrayAt(this.nodes, 0, generatedNodes);
			// this.redraw();
		},this), 3000);	
	} else {
		this.interval = undefined;
	}
};


/*
	Request currently suggested operations and plans from the server
*/
MixedVespy.InferenceUI.prototype.pull = function() {
	var node = MixedVespy.grid.get_current_node();
	this.suggestedNodesFromDemo = MixedVespy.planner.generateFromDemo(node, MixedVespy.editor.getDemo());
	// Retrieve nodes suggested by the agent from the server
	$.get("pull", $.proxy(function(data, status, xhr) {
		var suggestedNodesFromAgent = JSON.parse(data);
		this.nodes = _.union(this.suggestedNodesFromDemo, suggestedNodesFromAgent);
		this.redraw();
	},this));
};
/*
	Using local planner to get operations
*/
MixedVespy.InferenceUI.prototype.infer = function(node) {
	// ALL EXISTING NODES ARE POTENTIAL INPUT NODES
	var Is = _.without(MixedVespy.page.nodes, node);
	// GENERATE OPERATIONS FOR DEMOSTRATION IN THE CONTENT
	var demoSuggestions = MixedVespy.planner.generateFromDemo(MixedVespy.editor.demo);
	// INFER SINGLE / MULTI-STEP MODULES	
	var taskSuggestions = (node.V && node.V.length>0)? MixedVespy.planner.plan(Is, node) : [];	
	// GET THE REST OPERATIONS
	var operation_all = _.map(MixedVespy.planner.get_all_operations(), function(op) {
		if(operation_types.indexOf(op.type)!==-1) op.applicable=true;
		else op.applicable=false;
		return op;
	});
	this.operations = _.union(taskSuggestions, operation_all);
	this.redraw();
};

MixedVespy.InferenceUI.prototype.redraw = function() {
	$(this.target).empty();	
	for(var i in this.nodes) {
		$(this.target).append(this.renderOperation(this.nodes[i]));
	}
};

MixedVespy.InferenceUI.prototype.renderOperation = function(node) {
	var el = $("<li></li>");
	var P = node.P;
	// CREATING TITLE and DESCRIPTION OF OPERATION
	if(typeof P==='undefined') {
		// $("<div class='title'></div>").text(title).append("No Title");
		$("<div class='description'></div>").append("No description");
	} else {
		// var title_el = $("<div class='title'></div>");
		// var title = (P.type)? P.type.toUpperCase().replace("_"," "): "Unknown";
		// $(title_el).text(title).appendTo(el);
		var description_el = $("<div class='description'></div>");
		var description= this.renderDescription(node);
		$(description_el).html(description).appendTo(el);
	}
	// EVENT HANDLER : WHEN CLICKED, THE OPERATION UPDATES THE CURRENTLY SELECTED NODE
	$(el).click($.proxy(function(e) {
		var node_to_update = MixedVespy.grid.get_current_node();
		if(node_to_update.length==0) return;
		else{ 
			node_to_update.P = this.P;
			MixedVespy.grid.redraw({ execute:true });
			node_to_update.execute();
		}
	},{P:P}));
	return el;
};

MixedVespy.InferenceUI.prototype.renderDescription = function(node) {
	var desc = node.P.description;
	var desc_el = desc;
	var params_raw = desc.match(/\[\w+\]/g);
	if (params_raw===null) return desc;
	_.each(params_raw, function(praw) { // replace [key] to span element text
		var key = praw.replace(/\[|\]/g,'');
		if(typeof node.P.param==='undefined' || !(key in node.P.param)) return;
		var value = node.P.param[key];
		desc_el = desc_el.replace(praw,"<span class='param' paramKey='"+key+"'>"+value+"</span>");
	});
	desc_el = $("<span class='description'>"+desc_el+"</span>");	// convert to jQuery element
	$.each($(desc_el).find("span.param"), function(i, span) {
		if($(span).text().match(/\s*/g)[0]==$(span).text()) 
			$(span).css({
				'display':'inline-block',
				'vertical-align':'bottom'
			});
	});  
	return desc_el;
};









