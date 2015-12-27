sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/CommentDTO',
	'model/dao/Post'
], function (DTO, CommentDTO, Post) {
	"use strict";
	
	var PostDTO = DTO.extend("com.team6.noblog.model.dao.PostDTO", {
		
		_oPost : null,
		
		getPost: function() {
			return this._oComment;
		},
		
		_onPostDataChanged: function(oEvent) {
			console.log("change");
		},
		
		_mapServiceDataToDTO : function(oData) {
			// get important data from service
			var sTitle 			= oData["title"];
			var sContent 		= oData["content"];
			var oCreationDate 	= new Date(oData["creationDate"]);
			var oPost			= new Post(sTitle, oCreationDate, sContent);
			
			// pictureUrl is optional
			if( oData["pictureUrl"] ) {
				oPost.setPictureUrl(oData["pictureUrl"]);
			}
			
			// now create comments from data
			var sBasePath = this._oContext.getPath();
			var aComments = oData["comments"] || [];
			for( var i=0; i < aComments.length; i++ ) {
				oPost.addComment(new CommentDTO(this._oModel, sBasePath + "/comments/" + i));
			}
			
			// save and register for data changes
			this._oPost = oPost;
			this._oPost.attachChange(this._onPostDataChanged, this);
		},
		
		_mapDTOToServiceData: function() {
			
			if( this._oPost ) {
				var oData = {
					title 		: this._oPost.getTitle(),
					creationDate: this._oPost.getCreationDate(),
					content		: this._oPost.getContent(),
					comments	: []
				};
				
				// pictureUrl is optional so we must check if it is filled
				var sPictureUrl = this._oPost.getPictureUrl();
				if( sPictureUrl.length > 0 ) {
					oData["pictureUrl"] = sPictureUrl;
				}
				
				// insert comments into the structure
				var aComments = this._oPost.getComments();
				for( var i=0; i<aComments.length; i++ ) {
					oData.comments.push(aComments[i].getServiceData());
				}
				
				return oData;
			} else {
				throw new Error("No post data available!");
			}
		}
	});
	
	return PostDTO;
});