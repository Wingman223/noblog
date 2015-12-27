
var _oBlogDAOInstance = null;

sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/model/json/JSONModel',
	'model/dao/Blog',
	'model/Config'
], function (Object, JSONModel, Blog, Config) {
	"use strict";
	
	var BlogDAO = Object.extend("com.team6.noblog.model.dao.BlogDAO", {
		
		constructor: function() {
			if( _oBlogDAOInstance ) {
				throw new Error("Only one instance of BlogDAO allowed! Please use getInstance method");
			} else {
				_oBlogDAOInstance = this;
			}
		},
		
		loadBlog: function(sId, fnCallback) {
			var oModel 	= new JSONModel();
			var oBlog	= new Blog();
			var sPath	= Config.getDocument(sId);
			
			oModel.loadData(sPath);
			this._oModel.attachRequestCompleted(this._parseDataInModelContext, this);
			
			return oModel;
		},
		
		createBlog: function(oBlog) {
			
		},
		
		updateBlog: function(oBlog) {
			//TODO not implemented
		},
		
		removeBlog: function(sId) {
			//TODO not implemented
		},
		
		// ########################################################################
		// ### PROCESSING
		
		_parseDataInModelContext: function(oEvent) {
			var bSuccess = oEvent.getParameter("success");
			if( bSuccess ) {
				var oData = this._oModel.getData();
				this._mapServiceDataToBlogDTA(oData);
				
				var oParsedData = this._mapBlogDTAToServiceData();
				console.log(oData);
				console.log(oParsedData);
			} else {
				console.warn("Failed to load blog data!");
			}
		},
		
		// BLOG
		
		_mapServiceDataToBlogDTA: function(oData) {
			// map properties from service to dta
			this.setProperty("blogid"		, oData["_id"]);
			this.setProperty("type"			, oData["type"]);
			this.setProperty("creationDate"	, new Date(oData["creationDate"]));
			this.setProperty("title"		, oData["title"]);
			
			// map userid and username to user dta
			var oUser = new User();
			oUser.setUserData(oData);
			this.setAggregation("user"		, oUser);
			
			// map posts to post dta
			var aPosts = oData["posts"];
			for( var i=0; i<aPosts.length; i++ ) {
				this.addAggregation("posts", new Post(aPosts[i]))
			}
		},
		
		_mapBlogDTAToServiceData: function() {
			// Get blog and user data
			var oData = {
				_id 			: this.getBlogid(),
				type			: this.getType(),
				title			: this.getTitle(),
				creationDate	: this.getCreationDate(),
				posts			: []
			};
			var oUser 	= this.getUser().getServiceData();
			
			// Merge them together
			jQuery.sap.extend(oData, oUser);
			
			// Add posts afterwards
			var aPosts 	= this.getPosts();
			for( var i=0; i<aPosts.length; i++ ) {
				oData.posts.push(aPosts[i].getServiceData());
			}
			
			return oData;
		},
		
		// POST
		
		_mapServiceDataToPostDTA : function(oData) {
			// map properties from service to dta
			this.setProperty("title"		, oData["title"]);
			this.setProperty("content"		, oData["content"]);
			this.setProperty("creationDate"	, new Date(oData["creationDate"]));
			
			// pictureUrl is optional
			if( oData["pictureUrl"] ) {
				this.setProperty("pictureUrl", oData["pictureUrl"]);
			}
			
			var aComments = oData["comments"] || [];
			for( var i=0; i<aComments.length; i++ ) {
				this.addAggregation("comments", new Comment(aComments[i]));
			}
		},
		
		_mapPostDTAToServiceData: function() {
			
			var oData = {
				title 		: this.getTitle(),
				creationDate: this.getCreationDate(),
				content		: this.getContent(),
				comments	: []
			};
			
			// pictureUrl is optional so we must check if it is filled
			var sPictureUrl = this.getPictureUrl();
			if( sPictureUrl.length > 0 ) {
				oData["pictureUrl"] = sPictureUrl;
			}
			
			// insert comments into the structure
			var aComments = this.getComments();
			for( var i=0; i<aComments.length; i++ ) {
				oData.comments.push(aComments[i].getServiceData());
			}
			
			return oData;
		},
		
		// COMMENT
		
		_mapServiceDataToCommentDTA: function(oData) {
			// map properties from service to dta
			this.setProperty("content"		, oData["content"]);
			this.setProperty("creationDate"	, new Date(oData["creationDate"]));
			
			// map user to user dta
			var oUser = new User();
			oUser.setUserData(oData);
			this.setAggregation("user"		, oUser);
		},
		
		_mapCommentDTAToServiceData: function() {
			// Get comment and user data
			var oData = {
				content 		: this.getContent(),
				creationDate 	: this.getCreationDate()
			}
			var oUser = this.getUser().getServiceData();
			
			// Merge them together
			jQuery.extend(oData, oUser);
			
			return oData;
		}
	});
	
	com.team6.noblog.model.dao.BlogDAO.getInstance = function() {
		if( !_oBlogDAOInstance ) {
			new BlogDAO();
		}
		
		return _oBlogDAOInstance;
	};
	
	return BlogDAO;
});