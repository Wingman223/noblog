jQuery.sap.require("model.dao.BlogDAO");
jQuery.sap.require("model.dao.PostDTO");
jQuery.sap.require("model.dao.Post");

sap.ui.controller("view.detail.BlogPosts", {
	
	_oComponent			: null,
	_oView				: null,
	_oBlogDAO			: null,
	
	_oCreatePostDialog	: null,
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oBlogDAO		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		
		this._oView.bindElement({
			model	: "global_blog_model",
			path	: "/"
		});
	},
	
	// ###########################################################################
	// ### CREATE POST DIALOG
	
	handleButtonCreatePostPressed: function(oEvent) {
		// Lazy load dialog
		if(!this._oCreatePostDialog) {
			this._oCreatePostDialog = sap.ui.xmlfragment("view.fragment.CreatePostDialog", this);
			this._oView.addDependent(this._oCreatePostDialog);
		}
		
		// Reset model every time
		this._resetCreatePostModel();
		
		// Open
		this._oCreatePostDialog.open();
	},
	
	_resetCreatePostModel: function() {
		var oModel = new sap.ui.model.json.JSONModel({
			title : ""
		});
		this._oCreatePostDialog.setModel(oModel, "createpostdialog");
	},
	
	_getCreatePostModel: function() {
		return this._oCreatePostDialog.getModel("createpostdialog");
	},
	
	handleCreatePostDialogButtonCreatePressed: function(oEvent) {
		var oModel 			= this._getCreatePostModel();
		
		var sTitle			= oModel.getProperty("/title");
		var sContent		= oModel.getProperty("/content");
		var sPictureUrl		= oModel.getProperty("/pictureUrl") || null;
		
		var oUser			= this._oComponent.getUser();
		var oUserInline		= oUser.getUserInline();
		var oUserInlineDTO 	= new com.team6.noblog.model.dao.UserInlineDTO();
		oUserInlineDTO.setUserInline(oUserInline);
		
		if( !(sTitle || sTitle != "")) {
			sap.m.MessageBox.alert("Please enter a title!");
			return;
		}
		
		if(!(sContent || sContent != "")) {
			sap.m.MessageBox.alert("Please enter a content!");
			return;
		}
		
		var oPost		= new com.team6.noblog.model.dao.Post(sTitle, new Date(), sContent, sPictureUrl);
		var oBlogDAO 	= com.team6.noblog.model.dao.BlogDAO.getInstance();
		
		this._oCreatePostDialog.close();
	},
	
	handleCreatePostDialogButtonCancelPressed: function(oEvent) {
		this._oCreatePostDialog.close();
	},
	
	// ###########################################################################
	
	handleButtonLogInPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showLoginPopup(oSource);
	},
	
	handleButtonUserDetailsPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showUserDetailsPopover(oSource);
	}
});
