jQuery.sap.require("model.dao.BlogDAO");

sap.ui.controller("view.detail.BlogPostDetail", {
	
	onInit : function () {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oBlogDAO		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		
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
	
	handleButtonEditBlogPostPress: function(oEvent) {
		console.log(oEvent);
	},
	
	onCommentAdded: function (oEvent) {
		
		var blogCtx = this.getView().getBindingContext("global_blog_model");
		var blogModel = blogCtx.getModel();
		var blogPost = blogModel.getProperty(blogCtx.getPath());
		
		var data = blogModel.getData();
		
		var newComment = {
				userId : data.userId,
				content : oEvent.getParameter("value"),
				creationDate : new Date().getTime(),
		};
		
		var comments = blogPost.comments;
		comments.unshift(newComment);
		blogModel.setData(data);
		
		this._updateDocument(data._id, data, blogModel);
	},
	 
	_updateDocument: function (docId, data) {
		//Call jQuery ajax
		$.ajax({
		    type: "PUT",
		    contentType: "application/json; charset=utf-8",
		    url: model.Config.getDocument(docId),
		    data: JSON.stringify(data),
		    dataType: "json",
		    success: function (msg) {
		        alert('Success');
		    },
		    error: function (err){
		        alert('Error');
		    }
		})
	},
	
	handleButtonLogInPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showLoginPopup(oSource);
	},
	
	handleButtonUserDetailsPressed: function(oEvent) {
		var oSource = oEvent.getSource();
		this._oComponent.showUserDetailsPopover(oSource);
	},
	
	handleNavButtonBackPress: function() {
		this._oComponent.navBack();
	}
});