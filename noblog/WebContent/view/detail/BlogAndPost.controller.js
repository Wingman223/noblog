sap.ui.controller("view.detail.BlogAndPost", {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getRoute("home").attachMatched(this._loadLatestGlobalBlogPosts, this);
		this._router.getRoute("blog").attachMatched(this._loadLatestBlogPosts, this);
		
		this.getView().bindElement({
			model 	: "posts",
			path	: "/"
		});
	},
	
	_loadLatestGlobalBlogPosts : function (oEvent) {
		var oModel 	= new sap.ui.model.json.JSONModel();
		var sPath	= model.Config.getView("getLatestBlogEntries");
		
		oModel.loadData(sPath);
		
		this.getView().setModel(oModel);
	},
	
	_loadLatestBlogPosts : function (oEvent) {
		var blogID = oEvent.getParameter("arguments").id;
		var oModel 	= new sap.ui.model.json.JSONModel();
		var sPath	= model.Config.getDocument(blogID);
		
		oModel.loadData(sPath);
		
		this.getView().setModel(oModel);	
	}
});
