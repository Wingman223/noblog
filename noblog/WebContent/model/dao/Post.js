sap.ui.define([
	'model/dao/base/Observable',
	'model/dao/Comment'
], function (Observable, Comment) {
	"use strict";
	
	var Post = Observable.extend("com.team6.noblog.model.dao.Post", {
		metadata : {
			properties : {
				title 			: {type : "string"	, group : "Data", defaultValue : null},
				creationDate	: {type : "object"	, group : "Data", defaultValue : null},
				content			: {type : "string"	, group : "Data", defaultValue : null},
				pictureUrl		: {type : "string"	, group : "Data", defaultValue : null},
			},
			aggregations : {
				comments		: {type : "com.team6.noblog.model.dao.CommentDTO", multiple : true, singularName : "comment"}
			}
		},
		
		constructor: function(sTitle, oCreationDate, sContent, sPictureUrl) {
			Observable.prototype.constructor.apply(this);
			
			if(!(sTitle || oCreationDate || sContent)) {
				throw new Error("Not all required fields are filled!");
				return;
			}
			
			// required
			this.setProperty("title"		, sTitle);
			this.setProperty("creationDate"	, oCreationDate);
			this.setProperty("content"		, sContent);
			
			// optional
			if( sPictureUrl ) {
				this.setProperty("pictureUrl", sPictureUrl);
			}
		}
	});
	
	return Post;
});