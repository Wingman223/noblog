sap.ui.define([
	'sap/ui/base/ManagedObject',
	'model/dao/User'
], function (ManagedObject, User) {
	"use strict";
	
	var Comment = ManagedObject.extend("com.team6.noblog.model.dao.Comment", {
		metadata : {
			properties : {
				creationDate	: {type : "object"	, group : "Data", defaultValue : null},
				content			: {type : "string"	, group : "Data", defaultValue : null}
			},
			aggregations : {
				user			: {type : "com.team6.noblog.model.dao.User", multiple : false},
			}
		},
			
		constructor: function(oCommentData) {
			ManagedObject.prototype.constructor.apply(this);
			
			this._mapServiceDataToCommentDTA(oCommentData)
		},
		
		getServiceData: function() {
			return this._mapCommentDTAToServiceData();
		},
		
		_mapServiceDataToCommentDTA: function(oData) {
			// map properties from service to dta
			this.setProperty("content"		, oData["content"]);
			this.setProperty("creationDate"	, new Date(oData["creationDate"]));
			
			// map user to user dta
			this.setAggregation("user"		, new User(oData));
		},
		
		_mapCommentDTAToServiceData: function() {
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
	
	return Comment;
});