jQuery.sap.require("util.Formatter");
jQuery.sap.require("model.Config");
jQuery.sap.require("model.dao.BlogDAO");

sap.ui.controller("view.master.BlogList", {
	
	_oComponent	: null,
	_oView		: null,
	_oBlogDAO	: null,
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oBlogDAO		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		
		// attach route matched
		this._oComponent.attachRouteMatched("home", this.handleRouteHomeMatched, this);
		this._oBlogDAO.attachDataChanged(this._loadBlogs, this);
	},
	
	// PUBLIC
	handleRouteHomeMatched: function(oEvent) {
		this._loadBlogs();
		this._resetSearch();
	},
	
	handleBlogListItemPressed : function (oEvent) {
		// get selected blog id from item
		var oSource		= oEvent.getSource();
		var oContext	= oSource.getBindingContext("blogs");
		var sBlogId		= oContext.getProperty("id");
		
		// and navigate
		this._oComponent.navTo("blog", { id : sBlogId })
	},
	
	handleSearch : function(oEvent) {
		// get search term
		var oSearchField 	= this._getSearchField();
		var sSearchTerm 	= oSearchField.getValue();
		
		// refresh data first
		// then execute search ( in form of filter )
		this._loadBlogs();
		this._search(sSearchTerm);
	},
	
	// PRIVATE
	
	_loadBlogs : function() {
		var oModel 	= new sap.ui.model.json.JSONModel();
		var sPath	= model.Config.getBlogsServiceUrl();
		oModel.loadData(sPath);
		
		this._oView.setModel(oModel, "blogs");
	},
	
	_getSearchField: function() {
		return this._oView.byId("id_view_bloglist_input_search");
	},
	
	_search : function(sSearchTerm, fnLoaded) {
		
		var oBlogList 	= this._oView.byId("id_view_bloglist_list_blogs");
		var oBinding 	= oBlogList.getBinding("items");
		
		if( oBinding ) {
			// if user is actually searching for something
			if( sSearchTerm && sSearchTerm != "" ) {
				var oFilter = new sap.ui.model.Filter("value/name", sap.ui.model.FilterOperator.Contains, sSearchTerm);
				oBinding.filter([oFilter]);
			} else {
			// otherwise reset to default
				oBinding.filter([]);
			}
		}
	},
	
	_resetSearch : function() {
		var oSearchField 	= this._getSearchField();
		oSearchField.setValue("");
		
		this._search();
	}
});