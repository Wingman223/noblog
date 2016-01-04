sap.ui.define([
	'model/dao/base/Observable',
	'model/dao/Post',
	'model/dao/UserInline'
], function (Observable, Post, UserInline) {
	"use strict";
	
	var Blog = Observable.extend("com.team6.noblog.model.dao.Blog", {
		metadata : {
			properties : {
				blogid 			: {type : "string", group : "Data", defaultValue : null},
				revid			: {type : "string", group : "Data", defaultValue : null},
				type			: {type : "string", group : "Data", defaultValue : "blog"},
				title 			: {type : "string", group : "Data", defaultValue : null},
				creationDate	: {type : "object", group : "Data", defaultValue : new Date()}
			},
			aggregations : {
				user			: {type : "com.team6.noblog.model.dao.UserInlineDTO", multiple : false},
				posts			: {type : "com.team6.noblog.model.dao.PostDTO", multiple : true, singularName : "post"}
			}
		},
		
		constructor: function(sBlogid, sRevid, sTitle, oCreationDate, oUser, aPosts) {
			Observable.prototype.constructor.apply(this);
			
			// check if all required variables are filled
			if(!(sTitle || oCreationDate || oUser)) {
				throw new Error("Not all required fields are filled!");
				return;
			}
			
			// required
			this.setProperty("title", sTitle);
			this.setProperty("creationDate", oCreationDate);
			this.setAggregation("user", oUser);
			
			// optional
			// TODO refactor
			
			if( sBlogid && sBlogid != "" ) {
				this.setProperty("blogid", sBlogid);
			}
			
			if( sRevid && sRevid != "" ) {
				this.setProperty("revid", sRevid);
			}
			
			if( aPosts && aPosts.length && aPosts.lenth > 0 ) {
				this.setAggregation("aPosts", aPosts);
			}
		},
		
		// GETTER / SETTER
		// Only the ones that have been overridden. Rest is added by framework
		
		setType: function(sType) {
			// noop : type is always "blog"
		}
	});
	
	return Blog;
});