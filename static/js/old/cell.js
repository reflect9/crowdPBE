function Cell(p, page) {
	if(p) {
		this.I = typeof p.I !== 'undefined' ? _.clone(p.I) : ['_above','_left'];
		this.ID = typeof p.ID !== 'undefined' ? _.clone(p.ID) : makeid();
		this.P = typeof p.P !== 'undefined' ? jsonClone(p.P) : undefined;
		this.V = typeof p.V !== 'undefined' ? _.clone(p.V) : [];
		this.selected = typeof p.selected !== 'undefined' ? _.clone(p.selected) : false;
		this.position = typeof p.position !== 'undefined' ? _.clone(p.position) : undefined;
		this.type = typeof p.type !== 'undefined' ? _.clone(p.type) : undefined;
		this.executed = typeof p.executed !== 'undefined' ? _.clone(p.executed) : undefined;
		this.page = page;
	} else {
		this.I:['_above','_left'];
		this.ID= makeid();
		this.P= undefined;
		this.V= [];
		this.selected= false;
		this.position= undefined;
		this.type= undefined;
		this.executed= fals;
		this.page = undefined;
	}
	this.node_size = app.DEFAULT_NODE_DIMENSION;
}

Cell.prototype.duplicate = function() { };
Cell.prototype.execute = function() { };
Cell.prototype.draw = function(targetEl) {
	// NODE BASE
	var html = "<div class='node' id='"+this.ID+"'>\
		<div class='node_cover'>\
			<div class='nth-input-text hidden'></div>\
		</div>\
		<div class='node_content'></div>\
		<div class='node_borders'>\
			<div class='above'>\
				<div class='nth-input hidden'>2</div>\
				<i class='fa fa-caret-down fa-lg'></i>\
			</div>\
			<div class='below'>\
				<div class='nth-input hidden'>2</div>\
				<i class='fa fa-caret-up fa-lg'></i>\
			</div>\
			<div class='left'>\
				<div class='nth-input hidden'>2</div>\
				<i class='fa fa-caret-right fa-lg'></i>\
			</div>\
			<div class='right'>\
				<div class='nth-input hidden'>2</div>\
				<i class='fa fa-caret-left fa-lg'></i>\
			</div>\
		</div>\
		<div class='node_bg'></div>\
	</div>";
	var el = $(html);
	if(this.selected) el.attr("selected",true);
	if(this.P && this.P.kind) $(el).attr("kind",this.P.kind);
	var n_content = $(el).find(".node_content");
	// NODE HEAD: OPERATION
	var n_head_el; var n_data;
	if (this.node_size<NODE_SIZE_HIGH) {  // MID
		n_head_el = $("<div class='node-head'></div>").appendTo(n_content);
		$(n_head_el).append(this.getNodeIcon(node,this.node_size));
		if(this.P!==undefined)
			$(n_head_el).append("<div class='node-type'>"+this.P.type.toUpperCase().replace("_","<br>")+"</div>");
		n_data = $("<div class='node-values-mid'></div>")
			.append(this.getNodeValueTable(node,this.node_size))
			.appendTo(n_content);
	} 
	// when mouse is over the node, it highlights all the elements in the page 
	// if(this.V && _.isArray(this.V) && _.isElement(this.V[0])) {
	// 	$(n_data).hover(function() {
	// 		var id = $(this).parents(".node").attr("id");
	// 		var node = pg.panel.get_node_by_id(id);
	// 		pg.inspector.highlight_list(this.V);
	// 	},function() {
	// 		pg.inspector.unhighlight_list();
	// 	});
	// }
	$(el).disableSelection().css({
		'top':pg.panel.p2c(this.position)[0],
		'left':pg.panel.p2c(this.position)[1],
		'width':this.node_size,
		'height':this.node_size
	}).appendTo(targetEl);
};

Cell.prototype.getNodeValueTable = function() {
	// returns a Jquery DIV object of table represents node values.  
	// there are two possible detail levels (MID_DETAIL and HI_DETAIL)
	var table = $("<div class='node-table'></div>");
	var ul = $("<ul></ul>").appendTo(table);
	var num_v_to_draw = this.node_size / 13;
	_.each(node.V.slice(0,num_v_to_draw), function(v,vi,list) {
		var li = $("<li></li>").text(obj2text(v));
		// If the value is an element, attach selectionBox to highlight when mouse is over. 
		// if (_.isElement(v)){
		// 	$(li).hover(function() {
		// 		pg.inspector.highlight(v);
		// 	}, function() {
		// 		pg.inspector.unhighlight();
		// 	});
		// } 
		$(li).appendTo(ul);
	});
	return table;
};
Cell.prototype.getParamNodeID = function(paramKey) {
	var paramValue = this.P.param[paramKey];
	var n_I;
	if(paramValue && _.isString(paramValue) && paramValue.match(/input([0-9])/)) {
		n_I = parseInt(paramValue.match(/input([0-9])/)[1])-1;
		return this.I[n_I];
	} else return false;
};
Cell.prototype.getParamValue = function(paramKey) {
	var node_id = this.getParamNodeID(paramKey);
	if(node_id)	return pg.panel.get_node_by_id(node_id,node).V;
	else return str2value(node.P.param[paramKey]);
};
Cell.prototype.getNodeIcon = function() {
	var icon;
	if(this.node_size<NODE_SIZE_MID) {
		icon = $("<div class='node-icon node-icon-low'></div>");	
	} else {
		icon = $("<div class='node-icon node-icon-mid'></div>");	
	}
	if(this.P == undefined) { 
		$(icon).attr("operation","unknown");
	} else {
		$(icon).attr("operation",this.P.type);
		$(icon).attr("kind",this.P.kind);
		if(this.P.icon && _.isArray(this.P.icon) && this.P.icon.length==2) {
			$(icon).append("\
				<span class='fa-stack fa-lg'>\
				  <i class='fa fa-"+this.P.icon[0]+" fa-stack-lg'></i>\
				  <i class='fa fa-"+this.P.icon[1]+"'></i>\
				</span>\
			");
		} else {
			if(this.P.icon) $(icon).append("<i class='fa fa-"+this.P.icon+" fa-lg'></i>");	
		}
	}
	return icon;		
},


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// pg.Node = {
// 	create: function(p) {
// 		var n = {
// 				I:['_above','_left'], 
// 				ID: makeid(),
// 				P: undefined,
// 				V: [],
// 				selected: false,
// 				position: undefined,
// 				type: undefined,
// 				executed: false
// 			};
// 		if(p) {
// 			n.I = typeof p.I !== 'undefined' ? _.clone(p.I) : ['_above','_left'];
// 			n.ID = typeof p.ID !== 'undefined' ? _.clone(p.ID) : makeid();
// 			n.P = typeof p.P !== 'undefined' ? jsonClone(p.P) : undefined;
// 			n.V = typeof p.V !== 'undefined' ? _.clone(p.V) : [];
// 			n.selected = typeof p.selected !== 'undefined' ? _.clone(p.selected) : false;
// 			n.position = typeof p.position !== 'undefined' ? _.clone(p.position) : undefined;
// 			n.type = typeof p.type !== 'undefined' ? _.clone(p.type) : undefined;
// 			n.executed = typeof p.executed !== 'undefined' ? _.clone(p.executed) : undefined;
// 		}
// 		return n;
// 	},
// 	serialize: function(_n, _include_value) {
// 		var node = pg.Node.create(_n);
// 		if(typeof _include_value == 'undefined' || _include_value==true) {
// 			node.V = _.map(_n.V, function(v) {
// 				if(isDom(v)) return dom2jsonML(v);
// 				else return v;
// 			});
// 		} else {
// 			node.V = [];
// 		}
// 		node.selected = false;
// 		return JSON.stringify(node);
// 	},
// 	duplicate: function(n) {
// 		var dn = pg.Node.create(n);
// 		dn.selected = false;
// 		dn.ID = makeid();
// 		return dn;
// 	},
// 	execute: function(n) {
// 		if(!n.P) return;
// 		n.executed=true;
// 		pg.planner.execute(n);
// 		pg.panel.redraw();
// 	},
// 	draw: function(node,node_size) {
// 		// NODE BASE
// 		var html = "<div class='node' id='"+node.ID+"'>\
// 			<div class='node_cover'>\
// 				<div class='nth-input-text hidden'></div>\
// 			</div>\
// 			<div class='node_content'></div>\
// 			<div class='node_borders'>\
// 				<div class='above'>\
// 					<div class='nth-input hidden'>2</div>\
// 					<i class='fa fa-caret-down fa-lg'></i>\
// 				</div>\
// 				<div class='below'>\
// 					<div class='nth-input hidden'>2</div>\
// 					<i class='fa fa-caret-up fa-lg'></i>\
// 				</div>\
// 				<div class='left'>\
// 					<div class='nth-input hidden'>2</div>\
// 					<i class='fa fa-caret-right fa-lg'></i>\
// 				</div>\
// 				<div class='right'>\
// 					<div class='nth-input hidden'>2</div>\
// 					<i class='fa fa-caret-left fa-lg'></i>\
// 				</div>\
// 			</div>\
// 			<div class='node_bg'></div>\
// 		</div>";
// 		var n = $(html);
// 		if(node.selected) n.attr("selected",true);
// 		if(node.P && node.P.kind) $(n).attr("kind",node.P.kind);
// 		var n_content = $(n).find(".node_content");
// 		// DRAW INPUT ARROW
// 		// if (node.I.indexOf('_left') !== -1) 
// 		// 	$(this.getInputTriangle('right',[7,22]))
// 		// 		.css({position:'absolute', top:node_size/2-11, left:0}).appendTo(n);
// 		// if (node.I.indexOf('_above') !== -1) 
// 		// 	$(this.getInputTriangle('down',[22,7]))
// 		// 		.css({position:'absolute', left:node_size/2-11, top:0}).appendTo(n);

// 		// NODE HEAD: OPERATION
// 		var n_head_el; var n_data;
// 		if(node_size<NODE_SIZE_MID) {
// 			n_head_el = $(this.getNodeIcon(node,node_size)).appendTo(n_content); // show icon of tile type only
// 		} else if (node_size<NODE_SIZE_HIGH) {  // MID
// 			n_head_el = $("<div class='node-head'></div>").appendTo(n_content);
// 			$(n_head_el).append(this.getNodeIcon(node,node_size));
// 			if(node.P!==undefined)
// 				$(n_head_el).append("<div class='node-type'>"+node.P.type.toUpperCase().replace("_","<br>")+"</div>");
// 			n_data = $("<div class='node-values-mid'></div>")
// 				.append(this.getNodeValueTable(node,node_size))
// 				.appendTo(n_content);
// 		} else {	// HIGH.  FULL_ZOOM
// 			n_head_el = $("<div class='node-head'></div>").appendTo(n_content);
// 			pg.panel.commandUI.makeOperationInfo(node, n_head_el);
// 			// $(n_head_el).append(this.getNodeIcon(node,node_size));
// 			// if(node.P!==undefined) {
// 			// 	$(n_head_el).append("<div class='node-type'>"+node.P.type.toUpperCase()+"</div>");
// 			// 	$(n_head_el).append("<div class='node-description-high'>"+node.P.description+"</div>");  
// 			// }

// 			// full description
// 			n_data = $("<div class='node-values-high'></div>")
// 					.append(this.getNodeValueTable(node,node_size))
// 					.appendTo(n_content);
// 		}
// 		// when mouse is over the node, it highlights all the elements in the page 
// 		if(node.V && _.isArray(node.V) && _.isElement(node.V[0])) {
// 			$(n_data).hover(function() {
// 				var id = $(this).parents(".node").attr("id");
// 				var node = pg.panel.get_node_by_id(id);
// 				pg.inspector.highlight_list(node.V);
// 			},function() {
// 				pg.inspector.unhighlight_list();
// 			});
// 		}
// 		$(n).disableSelection().css({
// 			'top':pg.panel.p2c(node.position)[0],
// 			'left':pg.panel.p2c(node.position)[1],
// 			'width':node_size,
// 			'height':node_size
// 		}).appendTo($("#pg").find("#tiles"));
// 	},
// 	getNodeValueTable: function(node, node_size) {
// 		// returns a Jquery DIV object of table represents node values.  
// 		// there are two possible detail levels (MID_DETAIL and HI_DETAIL)
// 		var table = $("<div class='node-table'></div>");
// 		// $(table).addClass('node-table-'+detail_level);
// 		var ul = $("<ul></ul>").appendTo(table);
// 		var num_v_to_draw = node_size / 13;
// 		_.each(node.V.slice(0,num_v_to_draw), function(v,vi,list) {
// 			var li = $("<li></li>").text(obj2text(v));
// 			// If the value is an element, attach selectionBox to highlight when mouse is over. 
// 			if (_.isElement(v)){
// 				$(li).hover(function() {
// 					pg.inspector.highlight(v);
// 				}, function() {
// 					pg.inspector.unhighlight();
// 				});
// 			} 
// 			$(li).appendTo(ul);
// 		});
// 		return table;
// 	},
// 	getParamNodeID: function(node, paramKey) {
// 		var paramValue = node.P.param[paramKey];
// 		var n_I;
// 		if(paramValue && _.isString(paramValue) && paramValue.match(/input([0-9])/)) {
// 			n_I = parseInt(paramValue.match(/input([0-9])/)[1])-1;
// 			return node.I[n_I];
// 		} else return false;
// 	},
// 	getParamValue: function(node, paramKey) {
// 		var node_id = pg.Node.getParamNodeID(node,paramKey);
// 		if(node_id)	return pg.panel.get_node_by_id(node_id,node).V;
// 		else return str2value(node.P.param[paramKey]);
// 	},
// 	getNodeIcon: function(node, node_size) {
// 		var icon;
// 		if(node_size<NODE_SIZE_MID) {
// 			icon = $("<div class='node-icon node-icon-low'></div>");	
// 		} else {
// 			icon = $("<div class='node-icon node-icon-mid'></div>");	
// 		}
// 		// TILE_TYPES = ['Trigger','Page','Element','Variable','Operation'];
// 		/* icon for tile types */
// 		// var png_name= "glyphicons_153_unchecked";
// 		// if(node.P == undefined) {
// 		// 	 //
// 		// } else if(node.P.type=='extract_element' || node.P.type=='select_representative') {
// 		// 	png_name= "glyphicons_377_riflescope";
// 		// } else if(node.P.type=='get_attribute') {
// 		// 	png_name= "glyphicons_027_search";
// 		// } else if(node.P.type=='create') {
// 		// 	png_name= "glyphicons_009_magic";
// 		// } else if(node.P.type=='substring' || node.P.type=='compose_text') {
// 		// 	png_name= "glyphicons_164_iphone_transfer";
// 		// } else if(node.P.type=='set_attribute') {
// 		// 	png_name= "glyphicons_280_settings";
// 		// } else if(node.P.type=='call') {
// 		// 	png_name= "glyphicons_205_electricity";
// 		// } else if(node.P.type=='loadPage') {
// 		// 	png_name= "glyphicons_371_global";
// 		// }

// 		if(node.P == undefined) { 
// 			$(icon).attr("operation","unknown");
// 		} else {
// 			$(icon).attr("operation",node.P.type);
// 			$(icon).attr("kind",node.P.kind);
// 			if(node.P.icon && _.isArray(node.P.icon) && node.P.icon.length==2) {
// 				$(icon).append("\
// 					<span class='fa-stack fa-lg'>\
// 					  <i class='fa fa-"+node.P.icon[0]+" fa-stack-lg'></i>\
// 					  <i class='fa fa-"+node.P.icon[1]+"'></i>\
// 					</span>\
// 				");
// 			} else {
// 				if(node.P.icon) $(icon).append("<i class='fa fa-"+node.P.icon+" fa-lg'></i>");	
// 			}
// 			// if(node.P.kind=="pick")	$(icon).append("<i class='fa fa-search fa-2x'></i>");
// 			// if(node.P.kind=="transform")	$(icon).append("<i class='fa fa-share fa-2x'></i>");
// 			// if(node.P.kind=="apply")	$(icon).append("<i class='fa fa-magic fa-2x'></i>");
// 		}
		
// 		// var url = chrome.extension.getURL("js/lib/glyphicons/"+ png_name + ".png");
// 		// $(icon).css('background-image', 'url('+ url + ')');
		
// 		// var clickEventHandler = $.proxy(function() {
// 			// var nodes = pg.panel.infer(this);
// 			// if(nodes && nodes.length>0) {
// 			// 	pg.panel.insert(nodes[0],node);
// 			// 	pg.panel.redraw();
// 			// }
// 			// event.stopPropagation();
// 		// },node);
// 		// $(icon).click(clickEventHandler);
// 		return icon;		

// 		// if(node.type=='trigger') {
// 		// 	// if the trigger is for page-loading event
// 		// 	$(icon).addClass('node-icon-trigger');
// 		// 	// TBD. if the trigger for mouse click events
// 		// 	// TBD. if the trigger for mouse over events
// 		// } else if(node.type=='page') {
// 		// 	$(icon).addClass('node-icon-page');
// 		// } else if(node.type=='element') {
// 		// 	$(icon).addClass('node-icon-element');
// 		// } else if(node.type=='variable') {
// 		// 	$(icon).addClass('node-icon-variable');
// 		// } else if(node.type=='P') {
// 		// 	if(node.P.type=='pick') {
// 		// 		$(icon).addClass('node-icon-pick');
// 		// 	} else if(node.P.type=='inspect') {
// 		// 		$(icon).addClass('node-icon-inspect');
// 		// 	} else if(node.P.type=='create') {
// 		// 		$(icon).addClass('node-icon-create');
// 		// 	} else if(node.P.type=='transform') {
// 		// 		$(icon).addClass('node-icon-transform');
// 		// 	} else if(node.P.type=='modify') {
// 		// 		$(icon).addClass('node-icon-modify');
// 		// 	} else if(node.P.type=='call') {
// 		// 		$(icon).addClass('node-icon-call');
// 		// 	} else if(node.P.type=='loadURL') {
// 		// 		$(icon).addClass('node-icon-loadURL');
// 		// 	}
// 		// }
// 		// execute the node P and update the node value when the icon is clicked

// 	},
// 	getInputTriangle: function(direction, arrow_size) {
// 		var svg_html = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='"+arrow_size[0]+"' height='"+arrow_size[1]+"'> ";
// 		if(direction=='left') svg_html += "<polygon points='"+arrow_size[0]+",0 0,"+arrow_size[1]+" 0,"+(arrow_size[1]/2)+"' style='fill:white;' />";
// 		if(direction=='right') svg_html += "<polygon points='0,0 0,"+arrow_size[1]+" "+arrow_size[0]+","+(arrow_size[1]/2)+"' style='fill:white;' />";
// 		if(direction=='down') svg_html += "<polygon points='0,0 "+arrow_size[0]+",0 "+(arrow_size[0]/2)+","+arrow_size[1]+"' style='fill:white;' />";
// 		if(direction=='up') svg_html += "<polygon points='"+arrow_size[1]+",0 "+arrow_size[1]+","+arrow_size[0]+" "+arrow_size[0]/2+",0' style='fill:white;' />";
// 		svg_html += "</svg>";
// 		return $(svg_html);

// 		// var triangleSize = node_size/5;
// 		// var svg = $('<svg height='"+triangleSize+"'' width='"+triangleSize+"' xmlns='http://www.w3.org/2000/svg' version='1.1'></svg> ");
// 		// if(direction=='left') {
// 		// 	$(svg).append("<polygon points='0,0,0,20,15,10' style='fill:black;stroke:white;stroke-width:0'/>");	
// 		// } else if(direction='top') {
// 		// 	$(svg).append("<polygon points='0,0,0,20,15,10' style='fill:black;stroke:white;stroke-width:0'/>");
// 		// }
// 		// return svg;
// 	}



	


// };
