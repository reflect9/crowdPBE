MixedVespy.editor = {
	selectionBoxes: [],
	// timerToResetHighlight: 0,
	demoMode: undefined,
	// demo: {
	// 	modified:[]
	// }
};
MixedVespy.editor.getDemo = function() {
	return {
		marked_select: $.makeArray($(MixedVespy.contentPath).find("[marked='select']")),
		marked_remove: $.makeArray($(MixedVespy.contentPath).find("[marked='remove']")),
		marked_modify: $.makeArray($(MixedVespy.contentPath).find("[marked='modify']")),
		marked_create: $.makeArray($(MixedVespy.contentPath).find("[marked='create']")),
		modified:{}
	}

};

MixedVespy.editor.on = function(demoMode) {
	this.demoMode = demoMode;
	var marking_callback;
	switch(demoMode){
		case "select":
			marking_callback = function(e, ui){
				// WHEN ELEMENT IS CLICKED, JUST HIGHLIGHT IT
				var isMarked = $(e.target).attr("marked");
				if (typeof isMarked == "undefined" || isMarked == false) 
					$(e.target).attr("marked","select");	
				else $(e.target).removeAttr("marked");	
				e.preventDefault(); // PREVENT DEFAULT INTERACTION WITH THE CLICKED ELEMENT
				e.stopPropagation(); // PREVENT IT TO TRIGGER ALL CHILDREN ELEMENTS
			};
			break;
		case "remove":
			marking_callback = function(e, ui){
				// WHEN ELEMENT IS CLICKED, JUST HIGHLIGHT IT
				var isMarked = $(e.target).attr("marked");
				if (typeof isMarked == "undefined" || isMarked == false) 
					$(e.target).attr("marked","remove");	
				else $(e.target).removeAttr("marked");	
				e.preventDefault(); // PREVENT DEFAULT INTERACTION WITH THE CLICKED ELEMENT
				e.stopPropagation(); // PREVENT IT TO TRIGGER ALL CHILDREN ELEMENTS
			};
			break;
		case "modify":
			alert("NOT YET AVAILABLE");
			// TBD
			break;
		case "create":
			alert("NOT YET AVAILABLE");
			// TBD
			break;
	}
	// ASSIGN CLICK EVENt HANDLER TO THE CONTENT
	$(MixedVespy.contentPath).on("click","*",marking_callback);
	// $(MixedVespy.contentPath).on("click","*",function(e) {
	// 	// HIGHLIGHTING
	// 	var isMarked = $(e.target).attr("marked");
	// 	if (typeof isMarked == "undefined" || isMarked == false) {
	// 		$(e.target).attr("marked","select");	
	// 	} else {
	// 		$(e.target).removeAttr("marked");	
	// 	}
		// MixedVespy.inferenceUI.triggerPull();
		// MixedVespy.editor.timerToResetHighlight = 3;
		// STORE CLICKED ELEMENTS TO DEMO
		// e.preventDefault(); // PREVENT DEFAULT INTERACTION WITH THE CLICKED ELEMENT
		// e.stopPropagation(); // PREVENT IT TO TRIGGER ALL CHILDREN ELEMENTS
	// });
	// $(MixedVespy.contentPath).on("mouseenter","*",function(e) {
		// $(e.target).find(".mouseover").removeClass("mouseover");
		// $(e.target).addClass("mouseover");
		// e.stopPropagation();
	// });
	// $(MixedVespy.contentPath).on("mouseleave","*",function(e) {
		// $(e.target).find(".mouseover").removeClass("mouseover");
		// $(e.target).removeClass("mouseover");
		// e.stopPropagation();
	// });

	// SET TIMER TO RESET HIGHILGHT
	// MixedVespy.editor.resetTimer = setInterval($.proxy(function(){
	// 	if(MixedVespy.editor.timerToResetHighlight>0) {
	// 		MixedVespy.editor.timerToResetHighlight--;
	// 	} else {
	// 		MixedVespy.editor.resetHighlight();	
	// 	}  
	// },this), 5000);	
};
MixedVespy.editor.off = function() {
	$(MixedVespy.contentPath).off("click");
	this.resetHighlight();
};
MixedVespy.editor.resetHighlight = function() {
	$(MixedVespy.contentPath).find("*").removeAttr("marked");
	// $(MixedVespy.contentPath).find("*").removeClass("mouseover");
};


MixedVespy.editor.createHighlighter = function() {
	
};
MixedVespy.editor.destroyHighlighter = function() {
	
};
MixedVespy.editor.highlight = function(el) {
	
};
MixedVespy.editor.unhighlight = function() {
	
};

