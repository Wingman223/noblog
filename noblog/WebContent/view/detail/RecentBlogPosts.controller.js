jQuery.sap.require("model.dao.BlogDAO");
jQuery.sap.require("model.dao.Blog");
jQuery.sap.require("model.dao.UserInlineDTO");

sap.ui.controller("view.detail.RecentBlogPosts", {
	
	_oComponent			: null,
	_oView				: null,
	_oBlogDAO			: null,
	_oCreateBlogDialog	: null,	
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oBlogDAO		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		
		// attach events when data should be reloaded
		this._oComponent.attachRouteMatched("home", this._loadLatestGlobalBlogPosts, this);
		this._oBlogDAO.attachDataChanged(this._loadLatestGlobalBlogPosts, this);
		
		// bind element for easier model binding
		this._oView.bindElement({
			path	: "/"
		});
	},
	
	_loadLatestGlobalBlogPosts : function (oEvent) {
		var oModel 	= new sap.ui.model.json.JSONModel();
		var sPath	= model.Config.getView("getLatestBlogEntries");
		
		oModel.loadData(sPath);
		
		this.getView().setModel(oModel);
	},
	
	// ###########################################################################
	// ### CREATE BLOG DIALOG
	
	handleButtonCreateBlogPressed: function(oEvent) {
		// Lazy load dialog
		if(!this._oCreateBlogDialog) {
			this._oCreateBlogDialog = sap.ui.xmlfragment("view.fragment.CreateBlogDialog", this);
			this._oView.addDependent(this._oCreateBlogDialog);
		}
		
		// Reset model every time
		this._resetCreateBlogModel();
		
		// Open
		this._oCreateBlogDialog.open();
	},
	
	_resetCreateBlogModel: function() {
		var oModel = new sap.ui.model.json.JSONModel({
			title : ""
		});
		this._oCreateBlogDialog.setModel(oModel, "createblogdialog");
	},
	
	_getCreateBlogModel: function() {
		return this._oCreateBlogDialog.getModel("createblogdialog");
	},
	
	handleCreateBlogDialogButtonCreatePressed: function(oEvent) {
		var oModel 			= this._getCreateBlogModel();
		var sTitle			= oModel.getProperty("/title");
		
		var oUser			= this._oComponent.getUser();
		var oUserInline		= oUser.getUserInline();
		var oUserInlineDTO 	= new com.team6.noblog.model.dao.UserInlineDTO();
		oUserInlineDTO.setUserInline(oUserInline);
		
		if( sTitle && sTitle != "" ) {
			var oBlog 		= new com.team6.noblog.model.dao.Blog(null, sTitle, new Date(), oUserInlineDTO);
			var oBlogDAO 	= com.team6.noblog.model.dao.BlogDAO.getInstance();
			
			oBlogDAO.createBlog(oBlog, oUser, this._loadLatestGlobalBlogPosts.bind(this));
		} else {
			sap.m.MessageBox.alert("Please enter a title!");
		}
		
		this._oCreateBlogDialog.close();
	},
	
	handleCreateBlogDialogButtonCancelPressed: function(oEvent) {
		this._oCreateBlogDialog.close();
	},
	
	// ###########################################################################
	// ### AUTHENTICATION
	
	handleButtonLogInPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showLoginPopup(oSource);
	},
	
	handleButtonUserDetailsPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showUserDetailsPopover(oSource);
	}
});