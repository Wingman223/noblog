jQuery.sap.require("util.Formatter");
jQuery.sap.require("model.dao.BlogDAO");

sap.ui.controller("view.master.PostList", {
	
	_oComponent : null,
	_oView		: null,
	_oBlogDAO	: null,
	
	_oBlogDTO	: null,
	_sBlogId	: null,
	
	//FIXME counter to prevent over-navigation. Replace with proper method!
	_iNavCounter : 0,
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oBlogDAO		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		
		// attach events when data should be loaded
		this._oComponent.attachRouteMatched("blog", this.handleRouteBlogMatched, this);
		this._oComponent.attachRouteMatched("post", this.handleRouteBlogMatched, this);
		this._oBlogDAO.attachDataChanged(this._loadBlog, this);
	},
	
	// PUBLIC
	handleRouteBlogMatched: function(oEvent) {
		// save id in global variable
		this._sBlogId = oEvent.getParameter("arguments").id;
		
		// load blog info and reset search
		if( this._iNavCounter == 0 ) {
			this._loadBlog();
			this._resetSearch();
		}
		
		// FIXME reset counter
		this._iNavCounter = 0;
	},
	
	handlePostListItemPressed : function (oEvent) {
		var oSource		= oEvent.getSource();
		
		// get selected index of post item
		// for that get binding context path and split at last index "/"
		var oContext	= oSource.getBindingContext("global_blog_model");
		var sPath		= oContext.getPath();
		var sIndex		= sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
		
		// now we can assemble the information we need for navigation
		var iIndex		= parseInt(sIndex);
		var sBlogId		= this._sBlogId;
		
		// FIXME should be always true but one navigation is left out here so use a counter to determine 2nd navigation
		var bSaveNavigation = (this._iNavCounter > 0);
		this._iNavCounter++;
		// ------------------
		
		// and navigate
		this._oComponent.navTo("post", { id : sBlogId, index : iIndex }, bSaveNavigation);
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
		this._oComponent.navTo("home");
	},
	
	// PRIVATE
	
	/**
	 * Loads the blog document and makes ist globally available
	 */
	
	_loadBlog : function(oEvent) {
		// make sure that this._sBlogId is filled
		if( this._sBlogId && typeof this._sBlogId === "string" ) {
			var oBlogDTO 	= this._oComponent.loadBlog(this._sBlogId);
			var oModel		= oBlogDTO.getModel();
			
			this._oComponent.setModel(oModel, "global_blog_model");
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
