var _oUserDAOInstance = null;

sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/model/json/JSONModel',
	'model/dao/User',
	'model/Config'
], function (Object, JSONModel, User, Config) {
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
			var oUser	= new User();
			var sPath	= Config.getUser(sUsername);
			
			// first set model so that the DAO can register events
			oUser.setUserModel(oModel, fnCallback);
			
			// Now load the data
			// When username and password are correct the user is be able to get his information from the server
			// Either this fails or succeeds so we know when the credentials are wrong
			oModel.loadData(sPath, null, true, "GET", false, false, {
				Authorization : "Basic " + window.btoa(sUsername + ":" + sPassword)
			});
			
			return oUser;
		},
		
		getUser: function() {
			
		},
		
		createUser: function(oUser) {
			
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