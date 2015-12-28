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
			
			var oModel 		= new JSONModel();
			
			// build path to get userid from _users db
			var oUser		= new User(sUsername, sPassword);
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
		
		getUser: function(sUsername, sPassword, fnCallback) {
			//TODO try login logic
		},
		
		createUser: function(oUser) {
			
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
			
			var oUser = new User(sUsername, sPassword);
			
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
		}
	});
	
	com.team6.noblog.model.dao.UserDAO.getInstance = function() {
		if( !_oUserDAOInstance ) {
			new UserDAO();
		}
		return _oUserDAOInstance;
	};
	
	return UserDAO;
});