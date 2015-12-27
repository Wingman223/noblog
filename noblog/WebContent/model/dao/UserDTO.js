sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/User'
], function (DTO, User) {
	"use strict";
	
	var UserDTO = DTO.extend("com.team6.noblog.model.dao.UserDTO", {
		
		_oBlog		: null,
		
		_parseDataInModelContext: function(oEvent, fnCallback) {
			var bSuccess = oEvent.getParameter("success");
			if( bSuccess ) {
				var oData = this._oModel.getData();
				this._mapServiceDataToUserDTA(oData, true);
				
				var oParsedData = this._mapUserDTAToServiceData(true);
				console.log(oData);
				console.log(oParsedData);
			} else {
				console.warn("Failed to load user data!");
			}
			
			fnCallback(bSuccess);
		},
		
		_mapServiceDataToDTO: function(oData, bFull) {
			
			if( bFull ) {
				// Full to parse data from user service
				this.setProperty("userid"	, oData["_id"]);
				this.setProperty("type"		, oData["type"]);
				this.setProperty("username"	, oData["name"]);
				this.setProperty("surname"	, oData["surname"]);
				this.setProperty("prename"	, oData["prename"]);
				this.setProperty("email"	, oData["email"]);
				this.setProperty("roles"	, oData["roles"]);
				// after first commit of the password, we will only get it as a salt hash
				this.setProperty("password" , oData["salt"]);
			} else {
				// Minimal only for inline information about the user
				/*
				this.setProperty("id"		, oData["userid"]);
				this.setProperty("username"	, oData["username"]);
				*/
				// TODO for now the old way
				this.setProperty("userid"	, oData["userId"]);
				this.setProperty("username"	, oData["userName"] || "Demo");
			}
		},
		
		_mapDTOToServiceData: function(bFull) {
			if( bFull ) {
				// Full for registration or other purposes
				return  {
					_id 	: this.getUserid(),
					type 	: "",
					name 	: this.getUsername(),
					surname : this.getSurname(),
					prename	: this.getPrename(),
					email	: this.getEmail(),
					roles	: this.getRoles(),
					password: this.getPassword()
				}
			} else {
				// Minimal only for inline information about the user
				/*
				var oData = {
					userid 	: this.getId(),
					username: this.getUsername()
				}
				*/
				//TODO for now the old way
				return  {
					userId 	: this.getUserid(),
					userName: this.getUsername()
				}
			}
		}
		
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
	
	return UserDTO;
});