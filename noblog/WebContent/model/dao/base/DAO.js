sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/m/MessageBox'
], function (ManagedObject, MessageBox) {
	"use strict";
	
	var DAO = ManagedObject.extend("com.team6.noblog.model.dao.DAO", {
		metadata : {
			events : {
				dataChanged : {
					
				}
			}
		},
		
		/*
		constructor : function() {
			ManagedObject.prototype.constructor.apply(this);
		},
		*/
		
		_sendRequest : function(sUrl, sType, oDTO, sUsername, sPassword, fnSuccess, fnError) {
			
			if(!(sUrl || sType || oDTO || sUsername || sPassword || fnSuccess)) {
				throw new Error("Not all required fields are filled!");
			}
			
			// Check if type exists
			// TODO refactor
			var bFound = false
			for( var sProperty in DAO.REQUEST_TYPE ) {
				if(DAO.REQUEST_TYPE[sProperty] === sType ) {
					bFound = true;
					break;
				}
			}
			
			if(!bFound) {
				throw new Error("Request type does not exist! Please use DAO.REQUEST_TYPE");
			}
			
			// get data and convert it to json
			var oData		= oDTO.getServiceData();
			var sData		= JSON.stringify(oData);
			
			// send create to service and wait for response
			$.ajax({
				type 		: sType,
				contentType	: "application/json; charset=utf-8",
				url			: sUrl,
				data		: sData,
				dataType	: "json",
				username	: sUsername,
				password	: sPassword,
				success		: function(oData, sStatus, oRequest) {
					fnSuccess(oData, oRequest);
					this.fireDataChanged({});
				}.bind(this),
				error		: function(oRequest, sStatus, sMessage) {
					if( fnError ) {
						fnError(oRequest);
					} else {
						this._onRequestError(oRequest);
					}
				}.bind(this)
			});
		},
		
		_onRequestError: function(oError) {
			console.log(oError);
			MessageBox.alert("Request failed! See log for error message");
		}
	});
	
	DAO.REQUEST_TYPE = {
		"CREATE" : "POST",
		"READ"	 : "GET",
		"UPDATE" : "PUT",
		"DELETE" : "DELETE"
	};
	
	return DAO;
});