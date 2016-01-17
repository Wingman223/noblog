sap.ui.define([
	'model/dao/base/Observable',
	'model/dao/UserInline'
], function (Observable, UserInline) {
	"use strict";
	
	var User = UserInline.extend("com.team6.noblog.model.dao.User", {
		metadata : {
			properties : {
				type		: {type : "string"	, group : "Data", defaultValue : "user"},
				password	: {type : "string"	, group : "Data", defaultValue : null},
				surname		: {type : "string"	, group : "Data", defaultValue : null},
				prename		: {type : "string"	, group : "Data", defaultValue : null},
				email		: {type : "string"	, group : "Data", defaultValue : null},
				roles		: {type : "string[]", group : "Data", defaultValue : []}
			}
		},
		
		_oModel: null,
		
		constructor : function(sUsername, sPassword, sPrename, sSurname, sEmail, aRoles) {
			Observable.prototype.constructor.apply(this);
			
			if(!(sUsername || sPassword)) {
				throw new Error("Not all required fields are filled!");
			}
			
			// required
			this.setUsername(sUsername);
			this.setPassword(sPassword);
			
			// optional
			if(sPrename){this.setProperty("prename", sPrename);}
			if(sSurname){this.setProperty("surname", sSurname);}
			if(sEmail){this.setProperty("email", sEmail);}
			if(aRoles){this.setProperty("roles", aRoles);}
		},
		
		getUserInline: function() {
			return new UserInline(this.getUserid(), this.getUsername());
		},
		
		// GETTER / SETTER
		// Only the ones that have been overridden. Rest is added by framework
		
		setType: function(sType) {
			// noop : type is always "user"
		},
		
		setRoles: function(aRoles) {
			// noop : client can't assign roles
		},
		
		getFullname: function() {
			return this.getPrename() + " " + this.getSurname();
		}
	});
	
	return User;
});