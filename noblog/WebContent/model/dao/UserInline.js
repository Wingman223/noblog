sap.ui.define([
	'model/dao/base/Observable',
], function (Observable) {
	"use strict";
	
	var UserInline = Observable.extend("com.team6.noblog.model.dao.UserInline", {
		metadata : {
			properties : {
				userid 		: {type : "string"	, group : "Data", defaultValue : null},
				username 	: {type : "string"	, group : "Data", defaultValue : null}
			}
		},
		
		_oModel: null,
		
		constructor: function(sUserid, sUsername) {
			Observable.prototype.constructor.apply(this);
			
			if(!(sUserid || sUsername)) {
				throw new Error("Not all required fields are filled!");
			}
			
			// required
			this.setProperty("userid"	, sUserid);
			this.setProperty("username"	, sUsername);
		},
		
		// GETTER / SETTER
		// Only the ones that have been overridden. Rest is added by framework
		
		setUserid: function(sUserId) {
			//NOOP
		},
		
		setUsername: function(sUsername) {
			var sUserId = "org.couchdb.user:" + sUsername;
			
			this.setProperty("userid"	, sUserId);
			this.setProperty("username"	, sUsername);
		}
	});
	
	return UserInline;
});