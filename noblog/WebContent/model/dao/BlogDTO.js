sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/Blog',
	'model/dao/PostDTO',
	'model/dao/UserDTO',
], function (DTO, Blog, PostDTO, UserDTO) {
	"use strict";
	
	var BlogDTO = DTO.extend("com.team6.noblog.model.dao.BlogDTO", {
		
		_oBlog		: null,
		
		constructor: function(oModel) {
			// set default path as "/" and that the data is not loaded yet
			DTO.prototype.constructor.apply(this, [oModel, "/", true]);
		},
		
		// GETTER / SETTER
		// Mostly generated by the framework. Only the ones for local variables or
		// overridden getter / setter from the framework to alter the behavior ( readonly )
		
		getBlog: function() {
			return this._oBlog;
		},
		
		getUser: function() {
			return this._oBlog.getUser();
		},
		
		getPost: function(sPath) {
			return this._oBlog.getPost(sPath);
		},
		
		// PROCESSING
		
		_onBlogDataChanged: function(oEvent) {
			console.log("change");
		},
		
		_mapServiceDataToDTO: function(oData) {
			var sId				= oData["_id"];
			var sTitle			= oData["title"];
			var sType			= oData["type"];
			var sCreationDate 	= new Date(oData["creationDate"]);
			var oUser			= new UserDTO(oModel, "/");
			
			var oBlog 			= new Blog(sId, sTitle, oCreationDate, oUser);
			
			// map posts to post DTO
			var aPosts 			= oData["posts"];
			for( var i=0; i<aPosts.length; i++ ) {
				oBlog.addPost(new PostDTO(oModel, "/posts" + i));
			}
			
			// save and attach to changes
			this._oBlog = oBlog;
			this._oBlog.attachChange(this._onBlogDataChanged, this);
		},
		
		_mapDTOToServiceData: function() {
			if( this._oBlog ) {
				
				// Get blog and user data
				var oData = {
					_id 			: this._oBlog.getBlogid(),
					type			: this._oBlog.getType(),
					title			: this._oBlog.getTitle(),
					creationDate	: this._oBlog.getCreationDate(),
					posts			: []
				};
				var oUser = this._oBlog.getUser().getServiceData();

				// Merge them together
				jQuery.sap.extend(oData, oUser);
				
				// Add posts afterwards
				var aPosts = this._oBlog.getPosts();
				for( var i=0; i<aPosts.length; i++ ) {
					oData.posts.push(aPosts[i].getServiceData());
				}
				
				return oData;
				
			} else {
				throw new Error("No blog data available!");
			}
		}
	});
	
	return BlogDTO;
});