sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/UserInline'
], function (DTO, UserInline) {
	"use strict";
	
	var UserInlineDTO = DTO.extend("com.team6.noblog.model.dao.UserInlineDTO", {
		
		_oUserInline : null,
		
		constructor: function(oModel, sPath, bDataNotLoaded) {
			DTO.prototype.constructor.apply(this, [oModel, sPath, bDataNotLoaded]);
			
			// TODO additional logic can be added here
		},
		
		getUserInline : function() {
			return this._oUserInline;
		},
		
		_onUserInlineDataChanged: function(oEvent) {
			console.log("change");
		},
		
		_mapServiceDataToDTO: function(oData) {
			
			// Just for compatiblilty --------------------
			if( oData["userId"] ) {
				oData["userid"] = oData["userId"];
			}
			if( oData["userName"] ) {
				oData["username"] = oData["userName"];
			}
			// -------------------------------------------
			
			var sUserid 	= oData["userid"];
			var sUsername 	= oData["username"] || "Demo";
			
			this._oUserInline = new UserInline(sUserid, sUsername);
			this._oUserInline.attachChange(this._onUserInlineDataChanged, this);
		},
		
		_mapDTOToServiceData: function() {
			if( this._oUserInline ) {
				return {
					userid 	: this._oUserInline.getUserid(),
					username: this._oUserInline.getUsername()
				}
			} else {
				throw new Error("No user inline data available!");
			}
		}
	});
	
	return UserInlineDTO;
});