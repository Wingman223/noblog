sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/Blog',
	'model/dao/PostDTO',
	'model/dao/UserInlineDTO',
], function (DTO, Blog, PostDTO, UserInlineDTO) {
	"use strict";
	
	var BlogDTO = DTO.extend("com.team6.noblog.model.dao.BlogDTO", {
		
		// GETTER / SETTER
		// Mostly generated by the framework. Only the ones for local variables or
		// overridden getter / setter from the framework to alter the behavior ( readonly )
		
		// Getter
		
		getBlog: function() {
			return this.getObject();
		},
		
		getUser: function() {
			return this.getObject().getUser();
		},
		
		getPost: function(sPath) {
			return this.getObject().getPost(sPath);
		},
		
		// Setter
		
		setBlog: function(oBlog) {
			this.setObject(oBlog);
		},
		
		setModel: function(oModel) {
			DTO.prototype.setModel.apply(this, [oModel, "/", true]);
		},
		
		// ABSTRACT METHODS
		
		_checkDataObject: function(oObject) {
			return (oObject instanceof Blog);
		},
		
		_mapServiceDataToDTO: function(oData) {
			
			var sPath			= this.getPath();
			var sId				= oData["_id"];
			var sRev			= oData["_rev"];
			var sTitle			= oData["title"];
			var sType			= oData["type"];
			var oCreationDate 	= new Date(oData["creationDate"]);
			
			// map user
			var oUserInlineDTO	= new UserInlineDTO()
			oUserInlineDTO.setModel(this._oModel, "/");
			
			var oBlog 			= new Blog(sId, sRev, sTitle, oCreationDate, oUserInlineDTO, aPosts);
			
			// map posts to post DTO
			var aPosts			= oData["posts"];
			for( var i=0; i<aPosts.length; i++ ) {
				var oPost = new PostDTO()
				oPost.setModel(this._oModel, "/posts/" + i);
				oBlog.addPost(oPost);
			}
			
			return oBlog;
		},
		
		_mapDTOToServiceData: function(oBlog) {
			if(this._checkDataObject(oBlog)) {
				
				// Create blog structure
				var oCreationDate = oBlog.getCreationDate();
				var iCreationDate = oCreationDate.getTime();
				
				// required
				var oData = {
					type			: oBlog.getType(),
					title			: oBlog.getTitle(),
					creationDate	: iCreationDate,
					posts			: []
				};
				
				// optional
				if(oBlog.getBlogid()) {
					oData["_id"] = oBlog.getBlogid();
				}
				
				if(oBlog.getRevid()) {
					oData["_rev"] = oBlog.getRevid();
				}
				
				// Now add user
				var oUserDTO 	= oBlog.getUser()
				var oUser 		= oUserDTO.getServiceData();

				// Merge them together
				jQuery.sap.extend(oData, oUser);
				
				// Add posts afterwards
				var aPosts = oBlog.getPosts();
				for( var i=0; i<aPosts.length; i++ ) {
					oData.posts.push(aPosts[i].getServiceData());
				}
				
				return oData;
			} else {
				throw new Error("Blog data invalid!");
			}
		}
	});
	
	return BlogDTO;
});