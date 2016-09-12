MixedVespy.Pbe = function(target) {
	this.target = target;  
	this.node = undefined;
	this.init();
};

MixedVespy.Pbe.prototype.init = function(){
	// INITIALIZE BASIC UI


	// EVENT HANDLER FOR THE DEMONSTRATION TOOLS
	var buttons = $(this.target).find("button.mode");
	$(buttons).click($.proxy(function(event, ui) {
		this.mode($(event.target).attr("modetype"));
	},this));
};
MixedVespy.Pbe.prototype.redraw = function(){
	// UPDATE OUTPUT DATA OF THE CURRENT NODE
};



MixedVespy.Pbe.prototype.set_node = function(){

};
MixedVespy.Pbe.prototype.get_node = function(){

};

//////////////////////////////////////////////////////////////////
MixedVespy.Pbe.prototype.mode = function(mode){
	// this.reset_example_modes();
	this.reset_demo_modes();
	MixedVespy.editor.on(mode);
	// if(mode=="select" || mode=="remove" 
	// 	|| mode=="modify" || mode=="create") {
	// 	MixedVespy.editor.on(mode);
	// } 
	// else if (mode=="auto" || mode=="manual" || mode=="mockup") { }
	$(this.target).find("button[modetype='"+mode+"']").attr("selected",true);
	$(this.target).find("div.detail[modetype='"+mode+"']").removeClass("hidden");
};

// MixedVespy.Pbe.prototype.reset_example_modes = function() {
// 	$(this.target).find(".example_tools").find("button.mode").removeAttr("selected");
// 	$(this.target).find(".example_tools").find("input").val("");
// 	$(this.target).find(".example_tools").find(".detail").addClass('hidden');
// };


MixedVespy.Pbe.prototype.reset_demo_modes = function() {
	MixedVespy.editor.off();	
	$(this.target).find(".demonstration_tools").find("button.mode").removeAttr("selected");
	$(this.target).find(".demonstration_tools").find(".detail").addClass('hidden');
};
