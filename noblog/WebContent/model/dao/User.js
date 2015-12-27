sap.ui.define([
	'sap/ui/base/ManagedObject'
], function (ManagedObject) {
	"use strict";
	
	var User = ManagedObject.extend("com.team6.noblog.model.dao.User", {
		metadata : {
			properties : {
				userid 		: {type : "string"	, group : "Data", defaultValue : null},
				type		: {type : "string"	, group : "Data", defaultValue : "user"},
				username 	: {type : "string"	, group : "Data", defaultValue : null},
				surname		: {type : "string"	, group : "Data", defaultValue : null},
				prename		: {type : "string"	, group : "Data", defaultValue : null},
				email		: {type : "string"	, group : "Data", defaultValue : null},
				roles		: {type : "string[]", group : "Data", defaultValue : null},
				password	: {type : "string"	, group : "Data", defaultValue : null}
			}
		},
		
		_oModel: null,
		
		constructor: function(sUsername, sPassword, sPrename, sSurname, sEmail) {
			ManagedObject.prototype.constructor.apply(this);
			
			if(sUsername){this.setUsername(sUsername);}
			if(sPassword){this.setPassword(sPassword);}
			if(sPrename){this.setPrename(sPrename);}
			if(sSurname){this.setSurname(sSurname);}
			if(sEmail){this.setEmail(sEmail);}
		},
		
		// GETTER / SETTER
		// Only the ones that have been overridden. Rest is added by framework
		
		setUserid: function(sUserid) {
			// noop : only username can set userid
		},
		
		setType: function(sType) {
			// noop : type is always "user"
		},
		
		setUsername: function(sUsername) {
			this.setProperty("userid", "org.couchdb.user:" + sUsername, true);
			this.setProperty("username", sUsername, true);
		},
		
		// DATA
		
		setUserData: function(oUserData) {
			this._mapServiceDataToUserDTA(oUserData);
		},
		
		setUserModel: function(oUserModel, fnCallback) {
			this._oModel = oUserModel;
			this._oModel.attachRequestCompleted(function(oEvent) {
				this._parseDataInModelContext(oEvent, fnCallback);
			}, this);
		},
		
		// PROCESSING
//		
//		getServiceData: function() {
//			return this._mapUserDTAToServiceData();
//		},
//		
//		_parseDataInModelContext: function(oEvent, fnCallback) {
//			var bSuccess = oEvent.getParameter("success");
//			if( bSuccess ) {
//				var oData = this._oModel.getData();
//				this._mapServiceDataToUserDTA(oData, true);
//				
//				var oParsedData = this._mapUserDTAToServiceData(true);
//				console.log(oData);
//				console.log(oParsedData);
//			} else {
//				console.warn("Failed to load user data!");
//			}
//			
//			fnCallback(bSuccess);
//		},
//		
//		_mapServiceDataToUserDTA: function(oData, bFull) {
//			
//			if( bFull ) {
//				// Full to parse data from user service
//				this.setProperty("userid"	, oData["_id"]);
//				this.setProperty("type"		, oData["type"]);
//				this.setProperty("username"	, oData["name"]);
//				this.setProperty("surname"	, oData["surname"]);
//				this.setProperty("prename"	, oData["prename"]);
//				this.setProperty("email"	, oData["email"]);
//				this.setProperty("roles"	, oData["roles"]);
//				// after first commit of the password, we will only get it as a salt hash
//				this.setProperty("password" , oData["salt"]);
//			} else {
//				// Minimal only for inline information about the user
//				/*
//				this.setProperty("id"		, oData["userid"]);
//				this.setProperty("username"	, oData["username"]);
//				*/
//				// TODO for now the old way
//				this.setProperty("userid"	, oData["userId"]);
//				this.setProperty("username"	, oData["userName"] || "Demo");
//			}
//		},
//		
//		_mapUserDTAToServiceData: function(bFull) {
//			if( bFull ) {
//				// Full for registration or other purposes
//				return  {
//					_id 	: this.getUserid(),
//					type 	: "",
//					name 	: this.getUsername(),
//					surname : this.getSurname(),
//					prename	: this.getPrename(),
//					email	: this.getEmail(),
//					roles	: this.getRoles(),
//					password: this.getPassword()
//				}
//			} else {
//				// Minimal only for inline information about the user
//				/*
//				var oData = {
//					userid 	: this.getId(),
//					username: this.getUsername()
//				}
//				*/
//				//TODO for now the old way
//				return  {
//					userId 	: this.getUserid(),
//					userName: this.getUsername()
//				}
//			}
//		}
		
		// How a user is created on CouchDB
		/*
		PUT http://localhost:8081/_users
		{
			  "_id": "org.couchdb.user:meinuser",
			  "name": "meinuser",
			  "roles": [],
			  "type": "user",
			  "password": ""
		}
		*/
	});
	
	return User;
});