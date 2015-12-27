sap.ui.define([
	'model/dao/base/Observable',
], function (Observable) {
	"use strict";
	
	var User = Observable.extend("com.team6.noblog.model.dao.User", {
		metadata : {
			properties : {
				userid 		: {type : "string"	, group : "Data", defaultValue : null},
				type		: {type : "string"	, group : "Data", defaultValue : "user"},
				username 	: {type : "string"	, group : "Data", defaultValue : null},
				password	: {type : "string"	, group : "Data", defaultValue : null},
				surname		: {type : "string"	, group : "Data", defaultValue : null},
				prename		: {type : "string"	, group : "Data", defaultValue : null},
				email		: {type : "string"	, group : "Data", defaultValue : null},
				roles		: {type : "string[]", group : "Data", defaultValue : []}
			}
		},
		
		_oModel: null,
		
		constructor: function(sUserid, sUsername, sPassword, sPrename, sSurname, sEmail, aRoles) {
			Observable.prototype.constructor.apply(this);
			
			if(!(sUserid && sUsername)) {
				throw new Error("Not all required fields are filled!");
			}
			
			// required
			this.setProperty("userid", sUserid);
			this.setProperty("username", sUsername);
			
			// optional
			if(sPassword){this.setProperty("password", sPassword);}
			if(sPrename){this.setProperty("prename", sPrename);}
			if(sSurname){this.setProperty("surname", sSurname);}
			if(sEmail){this.setProperty("email", sEmail);}
			if(aRoles){this.setProperty("roles", aRoles);}
		},
		
		// GETTER / SETTER
		// Only the ones that have been overridden. Rest is added by framework
		
		setUserid: function(sUserid) {
			// noop : only username can set userid
		},
		
		setUsername: function(sUsername) {
			this.setProperty("userid"	, "org.couchdb.user:" + sUsername, true, true);
			this.setProperty("username"	, sUsername, true, false);
		},
		
		setType: function(sType) {
			// noop : type is always "user"
		}
	});
	
	return User;
});