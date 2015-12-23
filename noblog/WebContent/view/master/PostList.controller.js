jQuery.sap.require("util.Formatter");

sap.ui.controller("view.master.PostList", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		
		// load blogs from service
		this._oComponent.attachRouteMatched("blog", this.handleRouteBlogMatched, this);
	},
	
	// PUBLIC
	handleRouteBlogMatched: function(oEvent) {
		// save id in global variable
		this._sBlogId = oEvent.getParameter("arguments").id;
		
		// load blog info and reset search
		this._loadBlog();
		this._resetSearch();
	},
	
	handleBlogListItemPress : function (oEvent) {
		console.log(oEvent);
	},

	handleSearch : function(oEvent) {
		// get search term
		var oSearchField 	= oEvent.getSource();
		var sSearchTerm 	= oSearchField.getValue();
		
		// refresh data first
		// then execute search ( in form of filter )
		this._loadBlog();
		this._search(sSearchTerm);
	},
	
	handleNavButtonBackPress: function(oEvent) {
		this._oComponent.navBack();
	},
	
	// PRIVATE
	
	_loadBlog : function(oEvent) {
		// make sure that this._sBlogId is filled
		if( this._sBlogId && typeof this._sBlogId === "string" ) {
			var oModel 	= new sap.ui.model.json.JSONModel();
			var sPath	= model.Config.getDocument(this._sBlogId);
			oModel.loadData(sPath);
			
			this._oComponent.setModel(oModel, "postModel");
		}
	},
	
	_getSearchField: function() {
		return this._oView.byId("id_view_postlist_input_search");
	},
	
	_search : function(sSearchTerm, fnLoaded) {
		
		var oPostList 	= this._oView.byId("id_view_postlist_list_posts");
		var oBinding 	= oPostList.getBinding("items");
		
		if( oBinding ) {
			// if user is actually searching for something
			if( sSearchTerm && sSearchTerm != "" ) {
				var oFilter = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sSearchTerm);
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
