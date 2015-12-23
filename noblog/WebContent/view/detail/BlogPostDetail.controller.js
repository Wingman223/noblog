sap.ui.controller("view.detail.BlogPostDetail", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		
		// attach route matched
		this._oComponent.attachRouteMatched("post", this.handleRoutePostMatched, this);
	},
	
	handleRoutePostMatched: function(oEvent) {
		var oArguments 	= oEvent.getParameter("arguments");
		var sBlogId		= oArguments.id;
		var iIndex		= oArguments.index;
		var sPath		= "/posts/" + iIndex;
		
		this.getView().bindElement({
			model 	: "global_blog_model",
			path	: sPath
		});
	},
	
	handleButtonLogInPress: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showLoginPopup(oSource);
	}
});