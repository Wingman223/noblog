sap.ui.define([
	'sap/ui/base/ManagedObject',
	'model/dao/Comment'
], function (ManagedObject, Comment) {
	"use strict";
	
	var Post = ManagedObject.extend("com.team6.noblog.model.dao.Post", {
		metadata : {
			properties : {
				title 			: {type : "string"	, group : "Data", defaultValue : null},
				creationDate	: {type : "object"	, group : "Data", defaultValue : null},
				content			: {type : "string"	, group : "Data", defaultValue : null},
				pictureUrl		: {type : "string"	, group : "Data", defaultValue : null},
			},
			aggregations : {
				comments		: {type : "com.team6.noblog.model.dao.Comment", multiple : true, singularName : "comment"}
			}
		},
		
		constructor: function(oPostData) {
			ManagedObject.prototype.constructor.apply(this);
			
			this._mapServiceDataToPostDTA(oPostData);
		},
		
		getServiceData: function() {
			return this._mapPostDTAToServiceData();
		},
		
		_mapServiceDataToPostDTA : function(oData) {
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
		}
	});
	
	return Post;
});