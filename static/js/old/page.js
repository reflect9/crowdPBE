// Constructor for Page Class
Vespy.Page = function(data) {
	this._initialData = {};
	for (var attrname in data) { 
		this._initialData[attrname] = data[attrname];  
	}
	this.id = data["id"];
	this.title = data["title"];
	this.url = data["url"];
	this.template = new Vespy.Template(this._initialData["template"],this);
	this.nodes = [];
	var nodeData = JSON.parse(data["nodes"]);
	for (i in nodeData) {
		this.nodes.push(new Vespy.Node(nodeData[i], this));
	} 
	this.update_next_node_property(this.nodes);
};
Vespy.Page.prototype.draw = function(template_target) {
	this.template.set_target(template_target);
	this.template.draw();
};
Vespy.Page.prototype.redraw = function() {
	this.update_next_node_property(this.nodes);
};
Vespy.Page.prototype.delete = function(node_to_delete) {
	this.nodes = _.without(this.nodes, node_to_delete);
	this.update_next_node_property(this.nodes);
};
Vespy.Page.prototype.delete_at = function(position_to_delete) {
	this.nodes = _.filter(this.nodes, function(n){ 
		return n.position!=position_to_delete; 
	});	
	this.update_next_node_property(this.nodes);
};
Vespy.Page.prototype.clear = function() {
	// var default_trigger_node = pg.Node.create({type:'trigger', P:pg.planner.get_prototype({type:"trigger"}), position:[0,1]});
	// default_trigger_node.P.param.event_source = "page";
	// this.nodes = [default_trigger_node];	
	this.nodes = [];
};
/* RETURNS A SERIALIZABLE JAVASCRIPT OBJECT OF CURRENT PAGE */
Vespy.Page.prototype.serializable = function() {
	_page = {
		"id": this.id,
		"title": this.title,
		"url": this.url,
		"template": this.template.serializable(),
		"nodes": _.map(this.nodes,function(n){
			return n.serializable();
		})
	};
	return _page;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  executions methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////
Vespy.Page.prototype.execute = function() {
	var nodes = this.get_nodes();
	_.each(nodes, function(n) { n.executed=false; n.V=[]; });
	var page_triggers = _.filter(nodes, function(node) {
		return 	node.P && node.P.param && node.P.type=='trigger' && 
				node.P.param.event_source=="page"; 
	});
	var triggered_nodes = _.uniq(_.flatten(_.map(page_triggers, function(t){ return t.next; })));
	this.run_triggered_nodes(triggered_nodes, false, false);
};

Vespy.Page.prototype.run_triggered_nodes = function(starting_nodes, _nodes, skip_redraw) {
	this.update_next_node_property(this.nodes);
	var nodes = (_nodes)? _.clone(_nodes): _.clone(this.get_nodes()); // clone all the nodes (or provided nodes)
	var nodesToExecute = this.get_reachable_nodes(starting_nodes, nodes, true); // including starting nodes
	_.each(nodesToExecute, function(n) { n.executed = false; });	
	// if(nodesToExecute==undefined || nodesToExecute.length==0 ) return;
	var queue = starting_nodes;
	var count=0;
	while(queue.length>0 && count<nodes.length){
		// console.log(_.map(this.nodes, function(n){ return n.next; }));
		var n = queue.pop();
		this.run_node(n, true);
		n.executed = true;
		var nodes_ready = this.get_ready_nodes(nodesToExecute, nodes);
		// var nodes_ready_not_yet_run = _.difference(nodes_ready, executed);
		queue = _.union(queue, nodes_ready);
		count++;
	}
	if(Vespy.grid)	{
		Vespy.grid.redraw();
		Vespy.grid.deselect();
	}
};

Vespy.Page.prototype.run_node = function(node, skip_redraw) {
	if(node.P && node.P.type!="trigger") node.executed = true;
	if(!node) return false;
	if(!node.P) return false;
	// pg.planner.execute(node);
	node.execute();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Editing methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////

Vespy.Page.prototype.insert = function(new_nodes, target_node) {
	// replace target_node with nodes and push nodes on the right side to right
	var target_position, nodes_range;
	nodes_range = get_nodes_range(new_nodes);
	if(target_node) {
		target_position = target_node.position;
		this.delete(target_node);
		if(new_nodes.length>1) {
			// push nodes right or below
			// _.each(this.get_nodes(), function(node) {
			// 	if(node.position[1]>target_position[1]) {
			// 		// for nodes on the right side of the target node
			// 		node.position[1] = node.position[1] + nodes_range.columns-1;
			// 	} else if(node.position[1]==target_position[1] && node.position[0]>target_position[0]) {
			// 		// for nodes that are below the target
			// 		node.position[0] = node.position[0] + nodes_range.rows - 1; 
			// 	}
			// });
		} 
	} else {
		// when there's no target node, append at the bottom
		var max_y = _.max(this.get_nodes(), function(n){ return n.position[0];}).position[0]+1;
		target_position = [max_y,1];
	}
	// set positions of the new nodes and push to enhancements.
	for(var ni=0; ni<new_nodes.length;ni++) {
		var nd = new_nodes[ni]; 	
		if(typeof nd.position !== 'undefined') {
			// when the node has relative positions
			nd.position=[target_position[0]+nd.position[0]-nodes_range.min_y, target_position[1]+nd.position[1]-nodes_range.min_x]; 	
		} else {
			// unless, just place them in one vertical line.
			nd.position=[target_position[0]+ni, target_position[1]]; 	
		}
		this.delete_at(nd.position);
		this.get_nodes().push(nd);
	}
	// convert absolute input connections to relative positions
	_.each(new_nodes, function(nd) {
		nd.I = _.map(nd.I, function(input_id) {	// replace nd.I with <left> if the left node is the input node.
			if(input_id === "_pageLoad") {
				var trigger_page_load = _.filter(this.get_nodes(), function(n) {
					return n.P && n.P.type=='trigger' && n.P.param && n.P.param.event_source==="page";
				});
				if(trigger_page_load.length>0) return trigger_page_load[0].ID;
			}
			if(input_id === this.get_node_by_id("_left",nd).ID) return "_left";
			else if(input_id === this.get_node_by_id("_above",nd).ID) return "_above";
			else if(input_id === this.get_node_by_id("_right",nd).ID) return "_right";
			else if(input_id === this.get_node_by_id("_below",nd).ID) return "_below";
			else return input_id;
		}, this);
	},this);
};
Vespy.Page.prototype.insert_at = function(new_nodes) {
	// all new nodes must have absolute positions
	for(var ni=0;ni<new_nodes.length;ni++) 
		if(typeof new_nodes[ni].position === 'undefined') return false;
	// now place new_nodes
	_.each(new_nodes, function(nd) {
		nd.I = _.map(nd.I, function(input_id) {	// replace nd.I with <left> if the left node is the input node.
			if(input_id === "_pageLoad") {
				var trigger_page_load = _.filter(this.get_nodes(), function(n) {
					return n.P && n.P.type=='trigger' && n.P.param && n.P.param.event_source==="page";
				});
				if(trigger_page_load.length>0) return trigger_page_load[0].ID;
			}
			if(input_id === this.get_node_by_id("_left",nd)) return "_left";
			else if(input_id === this.get_node_by_id("_above",nd)) return "_above";
			else if(input_id === this.get_node_by_id("_right",nd)) return "_right";
			else if(input_id === this.get_node_by_id("_below",nd)) return "_below";
			else return input_id;
		}, this);
	},this);
	for(var ni=0;ni<new_nodes.length;ni++) {
		var nd = new_nodes[ni];
		this.delete_at(nd.position);
		this.get_nodes().push(nd);
	}
};
Vespy.Page.prototype.push_at = function(new_node, target_position) {
	var candDiff = [[0,0],[1,0],[-1,0],[0,1],[0,-1]];
	for(var i in candDiff) {
		var newPos = [new_node.position[0]+candDiff[i][0],new_node.position[1]+candDiff[i][1]];
		if(this.get_node_by_position(newPos)==false) {
			new_node.position = newPos;
			this.get_nodes().push(new_node);
			this.redraw();
			return;
		}
	}
};
Vespy.Page.prototype.insert_column = function(col_num) {
	_.each(this.get_nodes(), function(n){
		if(n.position[1]>=col_num) n.position[1]+=1;
	});
};
Vespy.Page.prototype.insert_row = function(row_num) {
	_.each(this.get_nodes(), function(n){
		if(n.position[0]>=row_num) n.position[0]+=1;
	});
};
Vespy.Page.prototype.delete_column = function(col_num) {
	 this.set_nodes(_.filter(this.get_nodes(), function(n) {
		return n.position[1]!= col_num;
	}));
	_.each(this.get_nodes(), function(n){
		if(n.position[1]>=col_num) n.position[1]-=1;
	});
};
Vespy.Page.prototype.delete_row = function(row_num) {
	 this.set_nodes(_.filter(this.get_nodes(), function(n) {
		return n.position[0]!= row_num;
	}));
	_.each(this.get_nodes(), function(n){
		if(n.position[0]>=row_num) n.position[0]-=1;
	});
};
Vespy.Page.prototype.duplicate_node = function(_node){
	var node = _node; 
	var current_node = Vespy.grid.get_current_node();
	var newNode = current_node.duplicate();
	var candDiff = [[1,0],[-1,0],[0,1],[0,-1]]; // find empty spaces nearby
	for(var i in candDiff) {
		var newPos = [newNode.position[0]+candDiff[i][0],newNode.position[1]+candDiff[i][1]];
		if(this.get_node_by_position(newPos)==false) {
			newNode.position = newPos;
			this.nodes.push(newNode);
			return;
		}
	}
	console.log("To duplicate a node, the node must have an empty neighbor tile.");
};

///////////////////////////////////////////////////////////////////
///  Node getters
///////////////////////////////////////////////////////////////////
Vespy.Page.prototype.get_nodes = function() {
	return this.nodes;
};
Vespy.Page.prototype.get_adjacent_node = function(direction, node, _allNodes) {
	var allNodes = (_allNodes)?_allNodes: this.get_nodes();
	if(!direction || !node) return false;
	if(direction=="_left") return this.get_node_by_position([node.position[0], node.position[1]-1], allNodes);			
	if(direction=="_right") return this.get_node_by_position([node.position[0], node.position[1]+1], allNodes);			
	if(direction=="_above") return this.get_node_by_position([node.position[0]-1, node.position[1]], allNodes);			
	if(direction=="_below") return this.get_node_by_position([node.position[0]+1, node.position[1]], allNodes);							
	return false;
};

Vespy.Page.prototype.get_node_by_id = function(node_id, ref_node, _allNodes) {
	var allNodes = (_allNodes)?_allNodes: this.get_nodes();
	if(node_id===undefined || node_id===false) return false;
	if(node_id.substring(0,5) == '_left' && ref_node) {
		var new_node_id = node_id.substring(5); var old_node_id = node_id.substring(0,5);
		if(new_node_id.length>0) return this.get_adjacent_node("_left", this.get_node_by_id(new_node_id,ref_node), allNodes);
		else return this.get_adjacent_node("_left", ref_node, allNodes);	
	} else if(node_id.substring(0,6) == '_above' && ref_node)  {
		var new_node_id = node_id.substring(6); var old_node_id = node_id.substring(0,6);
		if(new_node_id.length>0) return this.get_adjacent_node("_above", this.get_node_by_id(new_node_id,ref_node), allNodes);
		else return this.get_adjacent_node("_above", ref_node, allNodes);	
	} else if(node_id.substring(0,6) == '_right' && ref_node)  {
		var new_node_id = node_id.substring(6); var old_node_id = node_id.substring(0,6);
		if(new_node_id.length>0) return this.get_adjacent_node("_right", this.get_node_by_id(new_node_id,ref_node), allNodes);
		else return this.get_adjacent_node("_right", ref_node, allNodes);	
	} else if(node_id.substring(0,6) == '_below' && ref_node)  {
		var new_node_id = node_id.substring(6); var old_node_id = node_id.substring(0,6);
		if(new_node_id.length>0) return this.get_adjacent_node("_below", this.get_node_by_id(new_node_id,ref_node), allNodes);
		else return this.get_adjacent_node("_below", ref_node, allNodes);	
	}
	//
	for(var i in allNodes) {
		if (allNodes[i].ID == node_id) return allNodes[i];
	}	return false;
};
Vespy.Page.prototype.get_node_by_position = function(position, _allNodes) {
	var allNodes = (_allNodes)?_allNodes: this.get_nodes();
	if(position===undefined || position===false) return false;
	for(var i in allNodes) {
		if (allNodes[i].position[0] == position[0] && allNodes[i].position[1] == position[1]) return allNodes[i];
	}	return false;
};	
Vespy.Page.prototype.update_next_node_property = function(nodes) {
	// nodes are originally singly-linked graph (backward). This method updates next property of each node
	// to point following nodes that this the current node as input.  
	_.each(nodes, function(node){ node.next = []; });
	for (i in nodes) {
		node = nodes[i];
		for (j in node.I) {
			inputNode = this.get_node_by_id(node.I[j], node);
			if (inputNode){
				inputNode.next = _.union(inputNode.next, node);		
				// console.log(inputNode.ID + "->" + node.ID);
				// console.log(inputNode);
				// console.log(node);
			}
		}
	}
	// console.log(_.map(nodes, function(n){return n.next; }));
};
Vespy.Page.prototype.get_reachable_nodes = function(_starting_nodes, scope_nodes, _include_triggers) {
	_.each(scope_nodes, function(n){ n.visited=false; });
	var queue = _.clone(_starting_nodes);
	while(queue.length>0) {
		var n = queue.pop();
		for (var i=0;i<n.next.length;i++){
			var next_n = n.next[i];
			if (_.indexOf(scope_nodes, next_n)==-1) { continue; }
			if(!next_n.visited) {
				if(!_include_triggers && next_n.P && next_n.P.type=="trigger") { continue; }
				queue.push(next_n);
				next_n.visited = true;
			}
		}
	}
	var reachable_nodes = _.filter(scope_nodes, function(n){ 
		return n.visited==true; });
	_.each(scope_nodes, function(n){ delete n.visited; }); 
	return reachable_nodes;
};
Vespy.Page.prototype.get_prev_nodes = function(node, _allNodes) {	
	var allNodes = (_allNodes)?_allNodes: this.get_nodes();
	var prevNodes = [];
	try{
		for(var i=0;i<node.I.length;i++) {
			prevNodes.push(this.get_node_by_id(node.I[i], node, allNodes));
		}	
	} catch(e) { 
		console.log(e.stack); }
	prevNodes = _.without(prevNodes, false, undefined);
	return prevNodes;
};
Vespy.Page.prototype.get_ready_nodes = function(_candidateNodes, _allNodes) {
	var allNodes = (_allNodes)?_allNodes: this.get_nodes();
	var candidateNodes = (_candidateNodes)? _candidateNodes: allNodes;
	var ready_nodes = _.filter(candidateNodes, function(n) {
		if(n.executed) return false;
		var prev_nodes = this.get_prev_nodes(n, allNodes);
		if (	prev_nodes.length>0 &&
				_.filter(prev_nodes, function(n) { return n.executed==false; }).length==0 ) 
			return true;
		else return false;	
	},this);
	return ready_nodes;
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

Vespy.Page.prototype.print = function(nodes) {
	var str = "";
	try{
		_.each(nodes, function(n) {
			if(n.P) { str += n.P.type + "["+n.position[0]+","+n.position[1]+"]("+n.executed+"), "; }
		});
		return str;	
	} catch(e) { console.error(e.stack); }
};

Vespy.Page.prototype.set_nodes = function(_nodes) {
	this.nodes = _nodes;
};