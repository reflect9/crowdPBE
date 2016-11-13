MixedVespy.Grid = function(target, page) {
	this.target = target;
	this.page = page;
};

MixedVespy.Grid.prototype.redraw = function() {
	// REMOVE ALL EXISTING NODE ELEMENTS
	$(this.target).find(".node").remove();
	// DRAW NEW NODES
	for (i in this.page.nodes) {
		$(this.target).append(this.page.nodes[i].draw());
	});
	// ADD EVENTLISTENERS
	this.addEventListners();
};

MixedVespy.Grid.prototype.get_current_node = function() {
	// RETURN CURRENTLY SELECTED NODE
};

MixedVespy.Grid.prototype.select = function(node) {
	// UNSELECT PREVIOUSLY SELECTED NODES and TOGGLE OFF DETAILS
	
	// SHOWS DETAILED INFORMATION OF SELECTED NODES
	// WHAT DOES SELECTION MEAN? 

};

MixedVespy.Grid.prototype.deselect = function(node) {
	// TURN OFF ALL THE INTERACITONS FOR NODE-SELECTION MODES

};

MixedVespy.Grid.prototype.addEventListeners = function() {
	$(".node")
	.off()
	.click($.proxy(function(e) {
		this._list.deselect();
		this._list.select(e.target);

	},{_list:this});
};


