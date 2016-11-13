MixedVespy.Grid = function(target, page) {
	this.target = target;	//  <ul> is the target of grid -> each node is <li class='node'>
	this.page = page;
	this.redraw();
	// SORTABLE
	$(this.target).sortable({
		cancel: "span.param, input", 
		update: function(event, ui) {
			var node_el_list = $.makeArray($(MixedVespy.grid.target).find("li.node"));
			var id_sorted = _.map(node_el_list, function(el, i) {	
				return $(el).attr("nID");
			});
			MixedVespy.page.set_positions_from_id_list(id_sorted);
			MixedVespy.grid.redraw();
		}
	});
		
};

MixedVespy.Grid.prototype.redraw = function() {
	// REMOVE ALL EXISTING NODE ELEMENTS
	$(this.target).find(".node").remove();
	// DRAW NEW NODES
	for (i in this.page.nodes) {
		var node = this.page.nodes[i];
		node.set_position(parseInt(i));
		var node_el = node.draw();
		$(node_el).attr("position",i);
		$(node_el).find(".number").text(MixedVespy.num2code(parseInt(i)));
		$(this.target).append(node_el);
	}
	// ADD EVENTLISTENERS
	this.addEventListeners();
};

MixedVespy.Grid.prototype.get_current_node = function() {
	// RETURN CURRENTLY SELECTED NODE
	return _.filter(this.page.nodes, function(n){ return n.selected; })[0];
};

MixedVespy.Grid.prototype.select = function(node) {
	// UNSELECT PREVIOUSLY SELECTED NODES and TOGGLE OFF DETAILS
	_.each(this.page.nodes, function(n){ n.deselect(); });
	// SHOWS DETAILED INFORMATION OF SELECTED NODES
	node.select();
	// WHAT DOES SELECTION MEAN? 

};

MixedVespy.Grid.prototype.deselect = function(node) {
	// TURN OFF ALL THE INTERACITONS FOR NODE-SELECTION MODES

};

MixedVespy.Grid.prototype.addEventListeners = function() {
	$(".node")
	.off()
	.click($.proxy(function(e) {
		if(e.target.tagName=="INPUT") return;
		this.deselect();
		var node = this.page.nodes[parseInt($(e.currentTarget).attr("position"))];
		this.select(node);
	},this));
};


