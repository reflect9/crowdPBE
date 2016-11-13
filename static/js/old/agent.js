
function showOperations() {
	_.each(MixedVespy.planner.operations, function(op, op_key) {
		var el = $("<li></li>").text(op_key);
		$(el).attr("key",op_key);
		$("ul.suggestable_operations").append(el);
	});

}

function showPlans() {
	_.each(MixedVespy.planner.plans, function(op, op_key) {
		var el = $("<li></li>").text(op.type.replace(/_/g," "));
		$("ul.suggestable_plans").append(el);
	});
}

function addOperation(op_key) {
	var op_data = MixedVespy.planner.operations[op_key];
	var op_el = $("<li key='"+op_key+"'>");
	$("<span></span>").text(op_data.type).appendTo(op_el);
	for(var param_key in op_data.parameters) {
		var param_el = $("<div></div>").addClass("param");
		$("<span class='param_key'></span>").text(param_key).appendTo(param_el);
		$("<input class='param_value'>").appendTo(param_el);
		$(param_el).appendTo(op_el);
	}
	// DELETE 
	$("<button class='delete'>X</button>")
	.click(function(e) { $(e.target).parent("li").remove(); })
	.appendTo(op_el);
	// ATTACH
	$("ul.operations_to_suggest").append(op_el); 
}



$(document).ready(function() {
    showOperations();
    showPlans();

    // ATTACH EVENTLISTENERS FOR EACH PLAN

    // ATTACH EVENTLISTENERS FOR EACH OPERATION
    $("ul.suggestable_operations").on("click","li", function(e) {
    	addOperation($(e.target).attr("key"));
    });

    // SUBMIT CURRENT OPERATIONS
    $("button#submit").click(function(){
    	var node_list = _.map($("ul.operations_to_suggest li"), function(li){
    		var op_data_original = MixedVespy.planner.operations[$(li).attr('key')];
    		var op_data = { 
    			type: op_data_original.type,
    			description: op_data_original.description,
    			param: {}
    		};
    		// GET PARAMETER VALUES FROM THE INPUT BOXES AND UPDATE THE DATA
    		_.each($(li).find("div.param"), $.proxy(function(paramDiv){
    			var parameter_key = $(paramDiv).find(".param_key").text();
    			var parameter_value = $(paramDiv).find("input.param_value").val();
    			this.op_data.param[parameter_key] = parameter_value;
    		}, {op_data:op_data}));
    		// CREATE NODES
    		var node = new MixedVespy.Node();
    		node.P = op_data;
    		return node;
    	});
    	// SUBMIT IT BY PUSHING
    	$.get("push", {
    		data: JSON.stringify(node_list)
    	}, function(){ })
    });

});
