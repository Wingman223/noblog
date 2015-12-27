sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/User'
], function (DTO, User) {
	"use strict";
	
	var UserDTO = DTO.extend("com.team6.noblog.model.dao.UserDTO", {
		
		_oUser 	: null,
		_bFull	: false,
		
		constructor: function(oModel, sPath, bDataNotLoaded, bFull) {
			DTO.prototype.constructor.apply(this, [oModel, sPath, bDataNotLoaded]);
			
			// optional
			if( bFull ) {
				this._bFull = bFull;
			}
		},
		
		getUser : function() {
			return this._oUser;
		},
		
		_onUserDataChanged: function(oEvent) {
			console.log("change");
		},
		
		_mapServiceDataToDTO: function(oData) {
			
			if( this._bFull ) {
				var sUserid 	= oData["_id"];
				var sUsername 	= oData["name"];
				var sType 		= oData["type"];
				var sPrename 	= oData["prename"];
				var sSurname 	= oData["surname"];
				var sEmail		= oData["email"];
				var aRoles		= oData["roles"]
				// after first commit of the password, we will only get it as a salt hash
				var sPassword	= oData["salt"];
				
				this._oUser = new User(sUserid, sUsername, sPassword, sPrename, sSurname, sEmail, aRoles);
			} else {
				
				/*
				var sUserid 	= oData["userid"];
				var sUsername 	= oData["username"] || "Demo";
				*/
				
				//TODO for now the old way
				var sUserid 	= oData["userId"];
				var sUsername 	= oData["userName"] || "Demo";
				
				this._oUser = new User(sUserid, sUsername);
			}
			
			this._oUser.attachChange(this._onUserDataChanged, this);
		},
		
		_mapDTOToServiceData: function() {
			if( this._oUser ) {
				if( this._bFull ) {
					// Full for registration or other purposes
					return  {
						_id 	: this._oUser.getUserid(),
						type 	: this._oUser.getType(),
						name 	: this._oUser.getUsername(),
						surname : this._oUser.getSurname(),
						prename	: this._oUser.getPrename(),
						email	: this._oUser.getEmail(),
						roles	: this._oUser.getRoles(),
						password: this._oUser.getPassword()
					}
				} else {
					// Minimal only for inline information about the user
					/*
					var oData = {
						userid 	: this._oUser.getUserid(),
						username: this._oUser.getUsername()
					}
					*/
					//TODO for now the old way
					return  {
						userId 	: this._oUser.getUserid(),
						userName: this._oUser.getUsername()
					}
				}
			} else {
				throw new Error("No user data available!");
			}
		}
		
		// How a user is created in CouchDB
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
	
	return UserDTO;
});