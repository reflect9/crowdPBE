MixedVespy = {
	contentPath : "div.task_content",
	valueCapacity : 50,
	nodeCapacity : 50
};

MixedVespy.defaultProgram = {
	id:"1234",
	title:"First program",
	// nodes: '[{"I":["_above"],"ID":"VCwD4","V":[],"selected":false,"executed":false,"next":[]}]'
}


/* 
	Initializes the singleton MixedVespy object for the user page
	_data:  Must be an array of JSON object of individual nodes
	_target: Target element that encloses the grid object
*/
MixedVespy.init = function(_data) {
	MixedVespy.data = _data; 
	// LEFT PANE
	MixedVespy.page = new MixedVespy.Page(MixedVespy.data);
	// MID PANE
	// MixedVespy.spreadsheet = new MixedVespy.Spreadsheet($("div.spreadsheet_holder"));
	MixedVespy.pbe = new MixedVespy.Pbe($("div.pbe_holder"));
	MixedVespy.inferenceUI = new MixedVespy.InferenceUI($("ul.suggested_operations"));
	// RIGHT PANE
	MixedVespy.grid = new MixedVespy.Grid($("ul.nodes").get(0), MixedVespy.page);	
	MixedVespy.grid.select(MixedVespy.page.nodes[0]);
	////////////////////////////////////////////
	// ADDING BASIC EVENT LISTENERS
	$("button.add_new_node").click(function(){
		var emptyNode = new MixedVespy.Node();
		MixedVespy.page.insert(emptyNode);
		MixedVespy.grid.redraw();
		MixedVespy.grid.select(emptyNode);
	});
	$("button.run").click(function() {
		MixedVespy.page.execute();
	});
	$("button#task_reset").click(function() {
		$(MixedVespy.contentPath).find("[content_highlight]").removeAttr("content_highlight");
	});
	$("button.pull_suggestions").click(function() {
		// Request the server to get suggested operations and plans
		MixedVespy.inferenceUI.pull();
	});
	// EDITOR ON
	// MixedVespy.editor.on();
	// AUTO PULL ON
	// MixedVespy.inferenceUI.autoPull(true);


};


window.onbeforeunload = function() { return "You work will be lost."; };