sap.ui.define([
	'model/dao/base/Observable',
	'model/dao/User'
], function (Observable, User) {
	"use strict";
	
	var Comment = Observable.extend("com.team6.noblog.model.dao.Comment", {
		metadata : {
			properties : {
				creationDate	: {type : "object"	, group : "Data", defaultValue : null},
				content			: {type : "string"	, group : "Data", defaultValue : null}
			},
			aggregations : {
				user			: {type : "com.team6.noblog.model.dao.UserDTO", multiple : false},
			}
		},
			
		constructor: function(oUser, oCreationDate, sContent) {
			Observable.prototype.constructor.apply(this);
			
			if(!(oUser || oCreationDate || sContent)) {
				throw new Error("Not all required fields are filled!");
				return;
			}
			
			// required
			this.setProperty("creationDate"	, oCreationDate);
			this.setProperty("content"		, sContent);
			this.setAggregation("user"		, oUser);
		}
	});
	
	return Comment;
});