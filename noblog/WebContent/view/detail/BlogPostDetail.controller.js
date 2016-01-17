jQuery.sap.require("model.dao.BlogDAO");

sap.ui.controller("view.detail.BlogPostDetail", {
	
	_oComponent			: null,
	_oView				: null,
	_oBlogDAO			: null,
	_oCreatePostDialog 	: null,
	_iCurrentIndex 		: -1,
	
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
	
	// ################################################################
	// ### TEST
	
	handleButtonEditPostPressed: function(oEvent) {
		
		// get selected index of post item
		// for that get binding context path and split at last index "/"
		var oSource 	= oEvent.getSource();
		var oContext	= oSource.getBindingContext("global_blog_model");
		var sPath		= oContext.getPath();
		var sIndex		= sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
		var iIndex		= parseInt(sIndex);
		
		// Now get the corresponding blog item 
		var oBlogDAO 	= com.team6.noblog.model.dao.BlogDAO.getInstance();
		var oBlogDTO	= this._oComponent.getBlogDTO();
		var oPostDTO	= oBlogDTO.getPost(iIndex);
		var oPost		= oPostDTO.getPost();
		
		// Prepare dialog for update post
		var oDialog		= this._preparePostDialog(oPost);
		
		// Open
		oDialog.open();
	},
	
	_getPostDialog: function() {
		// Lazy load dialog
		if(!this._oCreatePostDialog) {
			this._oCreatePostDialog = sap.ui.xmlfragment("view.fragment.CreatePostDialog", this);
			this._oView.addDependent(this._oCreatePostDialog);
		}
		
		return this._oCreatePostDialog;
	},
	
	_preparePostDialog: function(oPost) {
		
		var oDialog		= this._getPostDialog();
		
		var bEdit 		= false;
		var sTitle 		= "";
		var sContent 	= "";
		var sPictureUrl = "";
		
		if( oPost ) {
			bEdit 		= true;
			sTitle 		= oPost.getTitle();
			sContent 	= oPost.getContent();
			sPictureUrl = oPost.getPictureUrl();
		} else {
			oPost		= null;
		}
		
		var oModel = new sap.ui.model.json.JSONModel({
			_data		: {
				edit 	: bEdit,
				post	: oPost
			},
			title 		: sTitle,
			content		: sContent,
			pictureUrl	: sPictureUrl
		});
		
		oDialog.setModel(oModel, "createpostdialog");
		
		return oDialog;
	},
	
	handlePostDialogButtonCancelPressed: function(oEvent) {
		this._oCreatePostDialog.close();
	},
	
	handlePostDialogButtonSavePressed: function(oEvent) {
		
		var oDialog			= this._getPostDialog();
		var oModel 			= oDialog.getModel("createpostdialog");
		var sTitle			= oModel.getProperty("/title");
		var sContent		= oModel.getProperty("/content");
		var sPictureUrl		= oModel.getProperty("/pictureUrl");
		
		// required
		if( !(sTitle || sTitle != "")) {
			sap.m.MessageBox.alert("Please enter a title!");
			return;
		}
		
		if(!(sContent || sContent != "")) {
			sap.m.MessageBox.alert("Please enter a content!");
			return;
		}
		
		// --------------------------------------------------------
		// Data is available ... proceeed!
		
		// Get logged in user and convert to inline user for post
		var oUserDTO	= this._oComponent.getUserDTO();
		var oUser		= oUserDTO.getUser();
		
		// Now get the current blog document data parse
		var oBlogDAO 	= com.team6.noblog.model.dao.BlogDAO.getInstance();
		var oBlogDTO	= this._oComponent.getBlogDTO();
		
		var bIsEdit	= oModel.getProperty("/_data/edit");
		if( bIsEdit ) {
			// User edited an existing post. Get post from model and update it
			var oPost = oModel.getProperty("/_data/post");
			
			oPost.setTitle(sTitle);
			oPost.setContent(sContent);
			oPost.setPictureUrl(sPictureUrl);
			oPost.setCreationDate(new Date());
		} else {
			// User created a new post. Transfer data to data object and corresponding dto
			var oBlog			= oBlogDTO.getBlog();
			var oUserInlineDTO	= oUserDTO.getUserInlineDTO();
			var oPost			= new com.team6.noblog.model.dao.Post(sTitle, new Date(), sContent, sPictureUrl, oUserInlineDTO);
			var oPostDTO		= new com.team6.noblog.model.dao.PostDTO();
			
			// insert post into blog
			oPostDTO.setPost(oPost);
			oBlog.insertPost(oPostDTO, 0);
		}
		
		// Now all changes are temporary visible
		// Submit immediately to persist the data
		oBlogDAO.updateBlog(oBlogDTO, oUser,
			function(oData, oRequest) {
				console.log("Update complete!")
				console.log(oData);
				console.log(oRequest);
			}.bind(this)
		);
		
		oDialog.close();
	},
	
	// ###########################################################################
	
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