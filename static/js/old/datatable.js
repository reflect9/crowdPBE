// Constructor for DataTable Class
Vespy.DataTable = function(data, target) {
	// CONSTANTS
	this.INITIAL_ROWS = 100;
	this.INITIAL_COLS = 30;
	this.CELL_HEIGHT = 20;
	this.CELL_WIDTH = 50;
	// /// 
	this.id = data.id;
	this.title = data.title;
	this.header = data.header;
	this.entry = data.entry;
	
	this.target = target;
	
}
Vespy.DataTable.prototype.serializable = function() {
	return {
		"id": this.id,
		"title": this.title,
		"header": this.header,
		"entry": this.entry
	};
};

// VIEW METHODS.   
Vespy.DataTable.prototype.show = function() {
	// 
};
Vespy.DataTable.prototype.hide = function() {
	// 
};
/* Save current datatable to the server
*/
Vespy.DataTable.prototype.pushDataTable = function() {
	var req = new XMLHttpRequest();
    req.open("POST", "pushDataTable", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "content="+JSON.stringify(this.serializable());
    Vespy.lastUpdatedTable = this;
    req.onreadystatechange = function() {
        if (req.readyState != 4 || req.status != 200) {
        	return;
        } else {
    		// Callback method here
    		if(Vespy.lastUpdatedTable) {
    			Vespy.lastUpdatedTable.redraw();
    		}
        	return;
        }
    };
    req.send(params);
};
/* Pull datatable from the server
*/
Vespy.DataTable.prototype.pullDataTable = function() {
	var req = new XMLHttpRequest();
    req.open("POST", "pullDataTable", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "DataTableID="+this.id;
    req.onreadystatechange = function() {
        if (req.readyState != 4 || req.status != 200) {
        	return;
        } else {
        	if (typeof callback != "undefined") {
        		// Callback method for updating current data
        	}	
        }
    };
    req.send(params);
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
Vespy.DataTable.prototype.redraw = function() {
	$(this.target).empty();
	// CREATE THEAD FIRST
	var headRow = $("<tr class='data_header_row'></tr>");
	for (var j=0; j<this.header.length; j++) {
		$("<th></th>").text(this.header[j]).appendTo(headRow);
	}
	$(headRow).appendTo(this.target);
	// NOW CREATE ROWS AND COLUMNS
	for (var i=0; i<this.entry.length; i++) {
		var aRow = $("<tr class='data_row'></tr>");
		for (var j=0; j<this.header.length; j++) {
			$("<td class='data_col'>"+this.entry[i][j]+"</td>").appendTo(aRow);
		}
		$(this.target).append(aRow);
	}
};
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// DATA RETRIEVAL METHODS
Vespy.DataTable.prototype.get_column = function(column) {
	var ci = this.header.indexOf(column);
	if (ci>-1) {
		return _.map(this.entry, function(et){
			return et[ci];
		});	
	} else {
		console.log("column name "+column+" is invalid.");
		return [];
	}
};
Vespy.DataTable.prototype.get_column_names = function() {
	return this.header;
};

// DATA REMOVING METHODS
Vespy.DataTable.prototype.row_delete = function(row_num) {
	this.entry.splice(row_num,1);
	this.pushDataTable();
};
Vespy.DataTable.prototype.row_delete_by_key = function(column, key) {
	var newRows = [];
	var column_data = this.get_column(column);
	for(var i=0;i<this.entry.length; i++) {
		if(column_data[i]!=key) {
			newRows.push(this.entry[i]);
		}
	} 
	this.entry = newRows;
	this.pushDataTable();
};

// DATA INSERTING
Vespy.DataTable.prototype.row_insert = function(row_num, new_row) {
	this.entry.splice(row_num,0,new_row);
	this.pushDataTable();
};

// DATA EDTING
Vespy.DataTable.prototype.row_modify = function(row_num, new_row) {
	this.entry[row_num] = new_row;
	this.pushDataTable();
};
Vespy.DataTable.prototype.row_modify_by_key = function(column, key, newColumn, newValue) {
	var id_newColumn = this.header.indexOf(newColumn);
	var column_data = this.get_column(column);
	for(var i=0;i<this.entry.length; i++) {
		if(column_data[i]==key) {
			this.entry[i][id_newColumn] = newValue;
		}
	} 
	this.pushDataTable();
};







