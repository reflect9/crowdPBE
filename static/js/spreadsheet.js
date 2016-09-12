MixedVespy.Spreadsheet = function(target) {
	this.target = target;  
	this.handson;
	this.rowNum =MixedVespy.valueCapacity;
	this.colNum =MixedVespy.nodeCapacity;
	this.init();
	// this.redraw();
};

MixedVespy.Spreadsheet.prototype.init = function() {
	// for (var ci=0; ci<this.colNum; ci++) {
	// 	this.data[ci] = [];
	// 	for(var ri=0; ri<this.rowNum; ri++) {
	// 		this.data[ci][ri]=undefined;
	// 	}
	// }

	/* Defined my own renderer for each cell value. 
			- If the value is a DOM element, use text value
			- If the value is number or text, use them. 
	*/
	this.customRenderer = function (instance, td, row, col, prop, value, cellProperties) {
		$(td).empty();
		if(value==null || typeof value=="undefined") return;
		else if(isDom(value)) $("<div class='data dom'>"+$(value).text().replace(/\s+/g," ")+"</div>").appendTo(td);
		else if(_.isNumber(value)) $("<div class='data value'>"+value+"</div>").appendTo(td);
		else if(_.isString(value)) $("<div class='data value'>"+value.replace(/\s+/g," ")+"</div>").appendTo(td);
	};
	this.columnSetting = [];
	for (var i=0; i<this.colNum; i++){
		this.columnSetting.push({  renderer: this.customRenderer });
	}
	// END OF CUSTOM RENDERER
	this.handson = new Handsontable($(this.target).get(0), {
		startRows: this.rowNum,
		startCols: this.colNum,
		minSpareCols: 1,
		//always keep at least 1 spare row at the right
		minSpareRows: 1,
		//always keep at least 1 spare row at the bottom,
		rowHeaders: true,
		colHeaders: true,
		contextMenu: true,
		autoColumnResize: false,
		manualColumnResize: true,
		// manualRowResize: true,
		columns: this.columnSetting
	});
	this.handson.updateSettings({
		contextMenu: {
			callback: function (key, options) {
				if (key === 'about') {
					alert("This is a context menu with default and custom options mixed");
				}
		      },
			items: {
				"copy_selected_cells": {
					name: "Copy",
					callback: function() {
						var range = MixedVespy.spreadsheet.handson.getSelected();
						MixedVespy.spreadsheet.clipboard = MixedVespy.spreadsheet.handson.getData(range[0],range[1],range[2],range[3]);
					}
				},
				"paste_selected_cells": {
					name: "Paste",
					callback: function() {
						var range = MixedVespy.spreadsheet.handson.getSelected();
						var clip = MixedVespy.spreadsheet.clipboard;
						for(var ri=0; ri<clip.length; ri++) {
							for(var ci=0; ci<clip[0].length; ci++) {
								MixedVespy.spreadsheet.handson.setDataAtCell(ri+range[0],ci+range[1],clip[ri][ci]);
							}
						}
					}
				},
				"hsep1": "---------",
				"row_above": {
		          disabled: function () {
		            return MixedVespy.spreadsheet.handson.getSelected()[0] === 0;     // if first row, disable this option
		          }
		        },
		        "row_below": {},
		        "hsep1": "---------",
		        "remove_row": {
		          name: 'Remove this row, ok?',
		          disabled: function () {
		            return MixedVespy.spreadsheet.handson.getSelected()[0] === 0  // if first row, disable this option
		          }
		        },
		        "hsep2": "---------",
		        "about": {name: 'About this menu'}
		      }
		    }
	})


	Handsontable.hooks.add("afterRender", function(){
		// AFTER EACH RENDERING, GET SUGGESTIONS
		MixedVespy.inferenceUI.triggerPull();
	}, this.handson);
	Handsontable.hooks.add("afterSelectionEnd", function(r,c,r2,c2){
		// WHENEVER A COLUMN IS HIGHLIGHTED, THE MATCHING NODE IS SELECTED 
		var nodeToSelect = MixedVespy.page.get_node_by_position(MixedVespy.num2code(c));
		MixedVespy.grid.select(nodeToSelect);
	}, this.handson);
};

// MixedVespy.Spreadsheet.prototype.redraw = function() {
// 	var data_as_text = _.map(this.data, function(rowData){
// 		return _.map(rowData, function(cellData) {
// 			return obj2text(cellData);
// 		});
// 	});
// 	this.handson = new Handsontable($(this.target).get(0), {
// 		data: data_as_text,
// 		startRows: 50,
// 		startCols: 50,
// 		minSpareCols: 1,
// 		//always keep at least 1 spare row at the right
// 		minSpareRows: 1,
// 		//always keep at least 1 spare row at the bottom,
// 		rowHeaders: true,
// 		colHeaders: true,
// 		contextMenu: true
// 	});
// };

MixedVespy.Spreadsheet.prototype.set_data = function(data) {
	this.handson.setData(data);
};

MixedVespy.Spreadsheet.prototype.get_column = function(position) {
	return this.handson.getDataAtCol(position);
	// return this.data[position];
};

MixedVespy.Spreadsheet.prototype.clear_column = function(columnNum) {
	for(var i=0;i<this.handson.countRows();i++) {
		this.handson.setDataAtCell(i, columnNum, null);
	}
};

MixedVespy.Spreadsheet.prototype.set_column = function(columnDataArray, columnNum) {
	this.clear_column(columnNum);	
	_.each(columnDataArray, function(cd, cdi){
		this.handson.setDataAtCell(cdi, columnNum, cd);
	},this);
};

MixedVespy.Spreadsheet.prototype.set_cell = function(cell, colNum, rowNum) {
	this.handson.setDataAtCell(rowNum, colNum, cell);
};



