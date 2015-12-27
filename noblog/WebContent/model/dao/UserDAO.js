var _oUserDAOInstance = null;

sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/model/json/JSONModel',
	'model/dao/User',
	'model/dao/UserDTO',
	'model/Config'
], function (Object, JSONModel, User, UserDTO, Config) {
	"use strict";
	
	var UserDAO = Object.extend("com.team6.noblog.model.dao.UserDAO", {
		
		constructor: function() {
			if( _oUserDAOInstance ) {
				throw new Error("Only one instance of UserDAO allowed! Please use getInstance method");
			} else {
				_oUserDAOInstance = this;
			}
		},
		
		tryLogin: function(sUsername, sPassword, fnCallback) {
			
			var oModel 	= new JSONModel();
			
			// build path to get userid from _users db
			var oUser		= new User(null, sUsername, sPassword);
			var oUserDTO	= new UserDTO(oModel, "/", true, true);
			var sPath		= Config.getUser(oUser.getUserid());
			
			// now set model so that the DTO can register events
			// also here is a hook for a callback when the dta finished processing
			oUserDTO.attachDataLoaded(function() {
				if( fnCallback ) {
					fnCallback(true);
				}
			});
			oUserDTO.attachDataError(function(){
				if( fnCallback ) {
					fnCallback(false);
				}
			});
			
			// Try to load userdata for user
			// When username and password are correct the user is able to get his information from the server
			// Either this fails or succeeds so we know when the credentials are wrong
			oModel.loadData(sPath, null, true, "GET", false, false, {
				Authorization : "Basic " + window.btoa(sUsername + ":" + sPassword)
			});
			
			return oUserDTO;
		},
		
		getUser: function() {
			
		},
		
		createUser: function(oUser) {
			/*
			$.ajax({
				type 		: "POST",
				contentType	: "application/json; charset=utf-8",
				
			})
			
			//Call jQuery ajax
			$.ajax({
			    type: "PUT",
			    contentType: "application/json; charset=utf-8",
			    url: model.Config.getDocument(docId),
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function (msg) {
			        alert('Success');
			    },
			    error: function (err){
			        alert('Error');
			    }
			})
			*/
		},
		
		updateUser: function(oUser) {
			//TODO not implemented
		},
		
		removeUser: function(sId) {
			//TODO not implemented
		},
		
		// ##################################################################
		// ### PROCESSING
		
		getServiceData: function() {
			return this._mapUserDTAToServiceData();
		},
		
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
		
		_mapServiceDataToUserDTA: function(oData, bFull) {
			
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
		
		_mapUserDTAToServiceData: function(bFull) {
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
		},
		
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
	
	com.team6.noblog.model.dao.UserDAO.getInstance = function() {
		if( !_oUserDAOInstance ) {
			new UserDAO();
		}
		return _oUserDAOInstance;
	};
	
	return UserDAO;
});