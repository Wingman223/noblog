sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/Comment',
	'model/dao/UserDTO'
], function (DTO, Comment, UserDTO) {
	"use strict";
	
	var CommentDTO = DTO.extend("com.team6.noblog.model.dao.CommentDTO", {
		
		_oComment : null,
		
		getComment: function() {
			return this._oComment;
		},
		
		_oCommentDataChanged: function(oEvent) {
			console.log("change");
		},
		
		_mapServiceDataToDTO: function(oData) {
			
			var sPath			= this.getPath();
			
			var oUserDTO 		= new UserDTO(this._oModel, sPath);
			var oCreationDate 	= new Date(oData["creationDate"]);
			var sContent		= oData["content"];
			
			var oComment		= new Comment(oUserDTO, oCreationDate, sContent);
			
			this._oComment = oComment;
			this._oComment.attachChange(this._oCommentDataChanged, this);
		},
		
		_mapDTOToServiceData: function() {
			if( this._oComment ) {
				// Get comment and user data
				var oData = {
					content 		: this._oComment.getContent(),
					creationDate 	: this._oComment.getCreationDate()
				}
				var oUser = this._oComment.getUser().getServiceData();
				
				// Merge them together
				jQuery.extend(oData, oUser);
				
				return oData;
			} else {
				throw new Error("No comment data available!");
			}
		}
	});
	
	return CommentDTO;
});