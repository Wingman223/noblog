sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/model/json/JSONModel',
	'model/Config'
], function (ManagedObject, JSONModel, Config) {
	"use strict";
	
	var User = ManagedObject.extend("com.team6.noblog.model.dao.User", {
		
	});
	
	return User;
});