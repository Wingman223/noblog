jQuery.sap.require("model.dao.BlogDAO");

sap.ui.controller("view.detail.BlogPostDetail", {
	
	_iCurrentIndex : -1,
	
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
		var iIndex		= parseInt(oArguments.index);
		var sPath		= "/posts/" + iIndex;
		
		this.getView().bindElement({
			model 	: "global_blog_model",
			path	: sPath
		});
		
		this._iCurrentIndex = iIndex;
	},
	
	handleButtonEditBlogPostPress: function(oEvent) {
		console.log(oEvent);
	},
	
	handleFeedInputPostAdded: function(oEvent) {
		
		// Check if current index is valid
		if( this._iCurrentIndex == -1 ) {
			throw new Error("Index of post is invalid");
			return;
		}
		
		// Index ok, then get data
		var oSource			= oEvent.getSource();
		var sComment		= oSource.getValue();
		
		if( !(sComment || sComment != "")) {
			sap.m.MessageBox.alert("You have to enter a comment text!");
			return;
		}
		
		// --------------------------------------------------------
		// Data is available ... proceeed!
		
		// Get logged in user and convert to inline user for post
		var oUserDTO		= this._oComponent.getUserDTO();
		var oUserInlineDTO	= oUserDTO.getUserInlineDTO();
		var oUser			= oUserDTO.getUser();
		
		// Now get the current blog document data parse
		var oBlogDAO 		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		var oBlogDTO		= this._oComponent.getBlogDTO();
		var oPostDTO		= oBlogDTO.getPost(this._iCurrentIndex);
		var oPost			= oPostDTO.getPost();
		
		// Create post and insert -> this will trigger the change event and update the model
		var oComment		= new com.team6.noblog.model.dao.Comment(oUserInlineDTO, new Date(), sComment);
		var oCommentDTO		= new com.team6.noblog.model.dao.CommentDTO();
		
		oCommentDTO.setComment(oComment);
		oPost.insertComment(oCommentDTO, 0);
		
		// Now all changes are temporary visible
		// Submit immediately to persist the data
		oBlogDAO.updateBlog(oBlogDTO, oUser,
			function(oData, oRequest) {
				console.log("Update complete!")
				console.log(oData);
				console.log(oRequest);
			}.bind(this)
		);
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