// Constructor for App Class
Vespy = {
	DEFAULT_PLATE_DIMENSION : 3000,
	DEFAULT_NODE_DIMENSION : 85,
	NODE_MARGIN : 2,
	DEFAULT_GRID_WIDTH : 600,
	NODE_SIZE_LOW : 30,
	NODE_SIZE_MID : 80,
	NODE_SIZE_HIGH : 150,
	TILE_TYPES : ['Trigger','Page','Element','Variable','Operation'],
	MAX_INFERENCE_STEPS : 3,
	MAX_CONTEXT_NODES : 20,
	MAX_INT : 9007199254740992,
	MIN_INT : -9007199254740992,
    mode : "automatic",
    documentBody : $("document")
};

Vespy.get_page_by_id = function(page_id) {
	return this.pages.filter(function(p){return p['id']==page_id;})[0];
};
Vespy.get_page_by_url = function(page_url) {
	return this.pages.filter(function(p){return p['url']==page_url;})[0];
};
Vespy.get_datatable_by_title = function(dt_title) {
    return this.datatables.filter(function(dt){return dt['title']==dt_title;})[0];
};
Vespy.get_datatable_titles = function() {
    return _.map(this.datatables, function(dt){return dt.title;} );
};

Vespy.request_app_data = function(callback) {
    var req = new XMLHttpRequest();
    req.open("GET", "retrieve?intent=load_app", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = function() {
        if (req.readyState != 4 || req.status != 200) return;
        Vespy.app_json = JSON.parse(req.responseText);
	    Vespy.title = Vespy.app_json.title;
        Vespy.id = Vespy.app_json.id;
	    Vespy.pages = [];
	    Vespy.datatables = [];
	    for (var i in Vespy.app_json.pages) Vespy.pages[i] = new Vespy.Page(Vespy.app_json.pages[i]); 
	    for (var i in Vespy.app_json.datatables) Vespy.datatables[i] = new Vespy.DataTable(Vespy.app_json.datatables[i],$("table.datatable")); 
        Vespy.documentBody = $(".template").get(0);
        callback();
    };
    req.send();
}
Vespy.serialize = function() {
	return JSON.stringify({
        "id": Vespy.id,
		"title": Vespy.title,
		"pages": _.map(Vespy.pages, function(p){ return p.serializable(); }),
		// "datatables": _.map(Vespy.datatables, function(d){ return d.serializable(); })
	});
}
Vespy.save = function(callback) {
	var req = new XMLHttpRequest();
    req.open("POST", "save", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "data="+Vespy.serialize();
    req.onreadystatechange = function() {
        if (req.readyState != 4 || req.status != 200) {
        	return;
        } else {
        	if (typeof callback != "undefined") callback();	
        }
    };
    req.send(params);
}
// FOLLOWING CALLBACK FUNCTIONS INITIALIZE VESPY FOR RUNTIME or BUILDER mode
Vespy.initialize_runtime = function(){
    Vespy.page = Vespy.get_page_by_url(PAGE_URL);
    // Vespy.template = new Vespy.Template($("#template_wrapper"), Vespy.page.template_src);
    // Vespy.template.draw();
    Vespy.page.draw($("#template"));
    Vespy.page.execute();
};
Vespy.initialize_builder = function(){
    // INIT PAGE SELECTION UI
    _.each(Vespy.pages, function(p) {
        $("ul.page_list").append("<li class='page_link' page-id='"+p.id+"'>"+p.title+"</li>");
    });
    // INIT DATATABLE SELECTION UI
    _.each(Vespy.datatables, function(dt) {
        $("<li class='datatable_link' dt-id='"+dt.id+"'>"+dt.title+"</li>")
            .click($.proxy(function(){
                this.dt.redraw();
            },{dt:dt}))
            .appendTo("ul#datatable_list");
    });
	Vespy.page = Vespy.pages[0];
    Vespy.datatables[0].redraw();
    // Vespy.page = Vespy.get_page_by_url(PAGE_URL);
    // Vespy.page.draw($("#template"));
    // Vespy.page.execute();
};
























