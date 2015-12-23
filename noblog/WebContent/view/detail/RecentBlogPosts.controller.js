sap.ui.controller("view.detail.RecentBlogPosts", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		
		this._oComponent.attachRouteMatched("home", this._loadLatestGlobalBlogPosts, this);
		
		this._oView.bindElement({
			path	: "/"
		});
	},
	
	handleButtonLogInPress: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showLoginPopup(oSource);
	},
	
	_loadLatestGlobalBlogPosts : function (oEvent) {
		var oModel 	= new sap.ui.model.json.JSONModel();
		var sPath	= model.Config.getView("getLatestBlogEntries");
		
		oModel.loadData(sPath);
		
		this.getView().setModel(oModel);
	}
});