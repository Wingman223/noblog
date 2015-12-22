sap.ui.controller("view.detail.NotFound", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oRouter		= this._oComponent.getRouter();
		this._oView			= this.getView();
		
		this._oRouter.getTargets().getTarget("notFound").attachDisplay(this._handleDisplay, this);
	},

	_msg : "<div class='titlesNotFound'>The requested product '{0}' is unknown to the shopping cart app.</div>",

	_handleDisplay : function (oEvent) {
		var oData 	= oEvent.getParameter("data");
		var html 	= this._msg.replace("{0}", oData.hash);
		
		this._oView.byId("msgHtml").setContent(html);
	},

	handleNavBack : function () {
		this._oComponent.navBack();
	}
});