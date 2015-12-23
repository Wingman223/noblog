sap.ui.define([
	'sap/ui/base/ManagedObject'
], function (ManagedObject) {
	"use strict";
	
	var User = ManagedObject.extend("com.team6.noblog.model.dao.User", {
		metadata : {
			properties : {
				userId 			: {type : "string", group : "Data", defaultValue : null},
				userName		: {type : "string", group : "Data", defaultValue : "blog"}
			}
		},
			
		constructor: function(oUserData) {
			ManagedObject.prototype.constructor.apply(this);
			
			this._mapServiceDataToUserDTA(oUserData)
		},
		
		getServiceData: function() {
			return this._mapUserDTAToServiceData();
		},
		
		_mapServiceDataToUserDTA: function(oData) {
			this.setProperty("userId"	, oData["userId"]);
			this.setProperty("userName"	, (oData["userName"] || "Demo"));
		},
		
		_mapUserDTAToServiceData: function() {
			return {
				userId 		: this.getUserId(),
				userName 	: this.getUserName()
			};
		}
	});
	
	return User;
});