sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/Post'
], function (DTO, Post) {
	"use strict";
	
	var PostDTO = DTO.extend("com.team6.noblog.model.dao.PostDTO", {
		
		_mapServiceDataToDTO : function(oData) {
			// map properties from service to dto
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
		
		_mapPostDTOToService: function() {
			
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
		}
	});
	
	return PostDTO;
});