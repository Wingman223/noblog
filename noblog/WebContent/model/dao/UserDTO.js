sap.ui.define([
	'model/dao/base/DTO',
	'model/dao/User'
], function (DTO, User) {
	"use strict";
	
	var UserDTO = DTO.extend("com.team6.noblog.model.dao.UserDTO", {
		
	});
	
	return UserDTO;
});