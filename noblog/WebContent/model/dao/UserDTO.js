sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/User'
], function (DTO, User) {
	"use strict";
	
	var UserDTO = DTO.extend("com.team6.noblog.model.dao.UserDTO", {
		
		_oUser 	: null,
		_bFull	: false,
		
		constructor: function(oModel, sPath, bDataNotLoaded) {
			DTO.prototype.constructor.apply(this, [oModel, sPath, bDataNotLoaded]);
			
			//TODO additional logic can be added here
		},
		
		getUser : function() {
			return this._oUser;
		},
		
		_onUserDataChanged: function(oEvent) {
			console.log("change");
		},
		
		_mapServiceDataToDTO: function(oData) {
			
			var sUserid 	= oData["_id"];
			var sUsername 	= oData["name"];
			var sType 		= oData["type"];
			var sPrename 	= oData["prename"];
			var sSurname 	= oData["surname"];
			var sEmail		= oData["email"];
			var aRoles		= oData["roles"]
			// after first commit of the password, we will only get it as a salt hash
			var sPassword	= oData["salt"];
			
			this._oUser = new User(sUsername, sPassword, sPrename, sSurname, sEmail, aRoles);
			this._oUser.attachChange(this._onUserDataChanged, this);
		},
		
		_mapDTOToServiceData: function() {
			if( this._oUser ) {
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
				throw new Error("No user data available!");
			}
		}
	});
	
	return UserDTO;
});