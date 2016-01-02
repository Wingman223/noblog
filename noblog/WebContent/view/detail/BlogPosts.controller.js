sap.ui.controller("view.detail.BlogPosts", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		
		this._oView.bindElement({
			model	: "global_blog_model",
			path	: "/"
		});
	},
	
	handleButtonLogInPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showLoginPopup(oSource);
	}
	
	/*
	_loadLatestBlogPosts : function (oEvent) {
		var sBlogID = oEvent.getParameter("arguments").id;
		var oModel 	= new sap.ui.model.json.JSONModel();
		var sPath	= model.Config.getDocument(blogID);
		
		oModel.loadData(sPath);
		
		this._oView.setModel(oModel);	
	}
	*/
});
