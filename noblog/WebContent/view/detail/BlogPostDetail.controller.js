sap.ui.controller("view.detail.BlogPostDetail", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		
		// attach route matched
		this._oComponent.attachRouteMatched("post", this.handleRoutePostMatched, this);
		
		
		/*this._router = sap.ui.core.UIComponent.getRouterFor(this);
		//this._router.getRoute("home").attachMatched(this._loadLatestGlobalBlogPosts, this);
		this._router.getRoute("blog").attachMatched(this._loadLatestBlogPosts, this);
		
		this.getView().bindElement({
			model 	: "global_blog_model",
			path	: "/"
		});
		*/
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
	}
});