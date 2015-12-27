sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/model/Context'
], function (ManagedObject, Context) {
	"use strict";
	
	var DTO = ManagedObject.extend("com.team6.noblog.model.dao.base.DTO", {
		
		getBindingContext: function(oModel, sPath) {
			return new Context(oModel, sPath);
		},
		
		getIndexFromPath : function(sPath) {
			return sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
		}
	});
	
	return DTO;
});