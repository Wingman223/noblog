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
			var oUser	= new User(oModel);
			var sPath	= Config.getDocument(sId);
			
			oModel.loadData(sPath);
			
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