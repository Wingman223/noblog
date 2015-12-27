sap.ui.define([
	'model/dao/base/Observable',
	'model/dao/Post',
	'model/dao/User'
], function (Observable, Post, User) {
	"use strict";
	
	var Blog = Observable.extend("com.team6.noblog.model.dao.Blog", {
		metadata : {
			properties : {
				blogid 			: {type : "string", group : "Data", defaultValue : null},
				type			: {type : "string", group : "Data", defaultValue : "blog"},
				title 			: {type : "string", group : "Data", defaultValue : null},
				creationDate	: {type : "object", group : "Data", defaultValue : new Date()}
			},
			aggregations : {
				user			: {type : "com.team6.noblog.model.dao.User", multiple : false},
				posts			: {type : "com.team6.noblog.model.dao.Post", multiple : true, singularName : "post"}
			}
		},
		
		constructor: function(sBlogid, sTitle, oCreationDate, oUser) {
			ManagedObject.prototype.constructor.apply(this);
			
			// check if all required variables are filled
			if(!(sTitle || oCreationDate || oUser)) {
				throw new Error("Blog.js : Not all required fields are filled");
				return;
			}
			
			// required
			this.setProperty("title", sTitle);
			this.setProperty("creationDAte", oCreationDate);
			this.setAggregation("user", oUser);
			
			// optional
			if( sId ) {
				this.setProperty("blogid", sBlogid);
			}
		}
	});
	
	return Blog;
});