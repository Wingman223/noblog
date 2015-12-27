sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/Comment'
], function (DTO, Comment) {
	"use strict";
	
	var CommentDTO = DTO.extend("com.team6.noblog.model.dao.CommentDTO", {
		
		_mapServiceDataToDTO: function(oData) {
			// map properties from service to dta
			this.setProperty("content"		, oData["content"]);
			this.setProperty("creationDate"	, new Date(oData["creationDate"]));
			
			// map user to user dta
			var oUser = new User();
			oUser.setUserData(oData);
			this.setAggregation("user"		, oUser);
		},
		
		_mapDTOToServiceData: function() {
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
	
	return CommentDTO;
});