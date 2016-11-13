MixedVespy.Node = function(other) {
	this.ID = makeid();
	this.P = undefined;
	this.selected = false;
	this.position = undefined;
	this.type = undefined;
	this.page = undefined; 
	if(other) {
		this.inColumn = typeof other.inColumn !== 'undefined' ? _.clone(other.inClumn) : [];
		this.ID = typeof other.ID !== 'undefined' ? _.clone(other.ID) : makeid();
		this.P = typeof other.P !== 'undefined' ? jsonClone(other.P) : undefined;
		this.selected = typeof other.selected !== 'undefined' ? _.clone(other.selected) : false;
		this.position = typeof other.position !== 'undefined' ? _.clone(other.position) : [0];
		this.type = typeof other.type !== 'undefined' ? _.clone(other.type) : undefined;
		this.page = typeof other.page !== 'undefined' ? _.clone(other.page) : undefined;
	}
};

MixedVespy.Node.prototype.execute = function() {
	MixedVespy.planner.execute(this);
};

MixedVespy.Node.prototype.select = function() {
	this.selected= true;
	if(this.el) { 	this.el.addClass("selected"); }
};
MixedVespy.Node.prototype.deselect = function() {
	this.selected= false;
	if(this.el) { 	this.el.removeClass("selected"); }
};

MixedVespy.Node.prototype.get_values = function() {
	var values = MixedVespy.spreadsheet.get_column(this.position);
	var i = values.length-1;
	while(values.length>0 && values[values.length-1]==null) values.pop();
	return values;
};

MixedVespy.Node.prototype.set_values = function(arr) {
	return MixedVespy.spreadsheet.set_column(arr, this.position);
};

MixedVespy.Node.prototype.set_position = function(i) {
	this.position=i;
};

MixedVespy.Node.prototype.get_input_nodes = function() {	
	// ANY OTHER NODE CAN BE INPUT NODES
	return _.without(MixedVespy.page.get_nodes(), this);
	// PRIOR NODES ARE INPUT NODES
	// return MixedVespy.page.get_nodes().slice(0,this.position);
};

/*	
	Returns HTML of the node representation
*/
MixedVespy.Node.prototype.draw = function() {
	var html = "<li class='node'>\
			<div class='number'></div>\
			<div class='controls'>\
				<button class='delete'>X</button>\
			</div>\
            <div class='operation'>\
                <!--<div class='title'></div>-->\
                <div class='description'></div>\
            </div>\
            <!--<table class='values'><tr></tr></table>-->\
        </li>";
    var el = $(html);
    $(el).attr("nID", this.ID);
    // INJECT Program details
    if(typeof this.P == "undefined") {
    	// $(el).find(".title").text("");
    	$(el).find(".description").html("<span style='color:#aaa;'>&nbsp;</span>");
    } else {
    	// $(el).find(".title").text(this.P.type.toUpperCase().replace("_"," "));
    	$(el).find(".description").append(this.renderDescription());
    }
    // RENDER VALUE LIST
    // var row = $(el).find("table.values tr");
    // for(var i in _.range(5)) {
    // 	var td = $("<td contenteditable></td>");
    // 	if(i <this.V.length)  $(td).text(obj2text(this.V[i]));
    // 	$(row).append(td);
    // }
    // ADD EVENTLISTENERS
    $(el).find("button.delete").click($.proxy(function() {
    	MixedVespy.page.delete(this);
    	MixedVespy.grid.redraw();
    },this));
    // FINALIZE
    this.el = el;
    return el;
    // TBD: configuration
};


MixedVespy.Node.prototype.renderOperation = function() {
	var el = $("<li></li>");
	var P = this.P;
	// CREATING TITLE and DESCRIPTION OF OPERATION
	if(typeof P==='undefined') {
		// $("<div class='title'></div>").text(title).append("No Title");
		$("<div class='description'></div>").append("No description");
	} else {
		// var title_el = $("<div class='title'></div>");
		// var title = (P.type)? P.type.toUpperCase().replace("_"," "): "Unknown";
		// $(title_el).text(title).appendTo(el);
		var description_el= this.renderDescription();
		$(description_el).appendTo(el);
	}
	// EVENT HANDLER : WHEN CLICKED, THE OPERATION UPDATES THE CURRENTLY SELECTED NODE
	$(el).click($.proxy(function(e) {
		var node_to_update = MixedVespy.grid.get_current_node();
		node_to_update.P = this.P;
		MixedVespy.grid.redraw();
	},{P:P}));
	return el;
};

MixedVespy.Node.prototype.renderDescription = function() {
	var desc = this.P.description;
	var desc_el = desc;
	var params_raw = desc.match(/\[\w+\]/g);
	if (params_raw===null) return desc;
	for (var i in params_raw) {
		var praw = params_raw[i];
		var key = praw.replace(/\[|\]/g,'');
		if(typeof this.P.param==='undefined' || !(key in this.P.param)) return;
		var value = this.P.param[key];
		desc_el = desc_el.replace(praw,"<span class='param' paramKey='"+key+"'>"+value+"</span>");
	}
	desc_el = $("<span class='description'>"+desc_el+"</span>");	// convert to jQuery element
	// NOW REPLACE WITH ACTION DATA
	$.each($(desc_el).find("span.param"), function(i, span) {
		if($(span).text().match(/\s*/g)[0]==$(span).text()) 
			$(span).css({
				'display':'inline-block',
				'vertical-align':'bottom'
			});
		// SHOWING INPUT BOX FOR EDITING PARAMETER
		$(span).click(function(event, ui) {
			var input = $("<input></input>");
			$(input)
			.val($(event.target).text())
			.css({
				width: $(event.target).width(),
			})
			.blur($.proxy(function(event, ui){
				// UPDATING PARAMETER
				var nID = $(event.target).parents("li.node").attr("nID");
				var paramKey = $(this.span).attr("paramKey");
				var paramValue = $(event.target).val(); 
				MixedVespy.page.get_node_by_id(nID).P.param[paramKey] = paramValue;
				// REMOVE INPUT BOX, SHOW SPAN AGAIN
				$(this.span).text(paramValue).show();
				$(event.target).remove();
			},{span:event.target}));
			$(event.target).after(input); 
			$(event.target).hide();
			$(input).focus();
			event.stopPropagation();
		});
	});  

	return desc_el;
};










