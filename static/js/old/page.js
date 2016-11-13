/*
	Page class represent an entire program of MixedVespy
*/


MixedVespy.Page = function(data) {
	this.id = data["id"];
	this.title = data["title"];
	this.nodes = [];
	if(data["nodes"]){
		this.set_nodes(data["nodes"]);  	
	} else {
		for(var i=0; i<MixedVespy.nodeCapacity; i++) {
			var node = new MixedVespy.Node();
			node.position = i;
			this.nodes.push(node);
		}
	}
};
MixedVespy.Page.prototype.set_nodes = function(node_data) {
	try {
		if(_.isString(node_data)) {
			this.nodes = _.map(JSON.parse(node_data), function(nd){
				return new MixedVespy.Node(nd);
			});	
		} else {
			this.nodes = node_data;
		}
	} catch(err){
		this.nodes = [];		
	}
};


MixedVespy.Page.prototype.clear = function() {
	this.nodes = [];
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Execution methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
	execute method runs multiple nodes
	"start_node" sets the the node to start execution; if undefined, it will start from the first node
	"end_node" sets the node to step; if undefined, it will execute at the last node	
*/
MixedVespy.Page.prototype.execute = function() {
	// _.each(this.get_nodes(), function(n){ n.executed=false; });
	_.each(this.get_nodes(), $.proxy(function(n){ 
		if(n.P) this.run_node(n);
		// n.executed = true;
	},this));
	// MixedVespy.spreadsheet.redraw();
};

/*	Executing an individual node by calling node.execute()
*/
MixedVespy.Page.prototype.run_node = function(node) {
	// This should check whether the node contains P (an operation) or not
	// if there's no issue, it will call node.execute();
	node.execute();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Selection methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////
MixedVespy.Page.prototype.get_nodes = function() {
	return this.nodes;
};
MixedVespy.Page.prototype.get_node_by_id = function(node_id) {
	return _.find(this.nodes, function(n){ return n.ID == node_id; });
};
MixedVespy.Page.prototype.get_node_by_position = function(positionAZ) {
	return this.nodes[MixedVespy.code2num(positionAZ)];
};
MixedVespy.Page.prototype.get_adjacent_node = function(direction, node, _allNodes) {
	// _allNodes constrains the search scope. If _allNodes is undefined, the search scope 
	// is the entire this.nodes

};
MixedVespy.Page.prototype.get_prev_nodes = function(node, _allNodes) {
	// returns all the ancesters of the node
};
MixedVespy.Page.prototype.get_input_nodes = function(node) {
	var inputNodes = [];
	try{
		for(var i=0;i<node.I.length;i++) {
			inputNodes.push(this.get_node_by_id(node.I[i], node));
		}	
	} catch(e) { 
		console.log(e.stack); }
	inputNodes = _.without(inputNodes, false, undefined);
	return inputNodes;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Editing methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////
MixedVespy.Page.prototype.insert = function(new_nodes, target_node) {
	// This will insert new_nodes pushing target_node below
	if(typeof target_node == "undefined") {
		if(_.isArray(new_nodes)) {
			this.nodes.concat(new_nodes);
		} else {
			this.nodes.push(new_nodes);	
		}
	} else {
		// INSERTING IN tHE MIDDLE
	}
	MixedVespy.editor.resetHighlight();
};
MixedVespy.Page.prototype.delete = function(node_to_delete) {
	this.nodes = _.without(this.nodes, node_to_delete);
};


MixedVespy.Page.prototype.set_positions_from_id_list = function(id_list) {
	var new_nodes = [];
	for(var i in id_list) {
		var node = this.get_node_by_id(id_list[i]);
		node.set_position(i);
		new_nodes.push(node);
	}
	this.nodes = new_nodes;
};







