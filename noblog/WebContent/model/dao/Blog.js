sap.ui.define([
	'sap/ui/base/ManagedObject',
	'model/dao/Post',
	'model/dao/User'
], function (ManagedObject, Post, User) {
	"use strict";
	
	var Blog = ManagedObject.extend("com.team6.noblog.model.dao.Blog", {
		
		metadata : {
			properties : {
				id 				: {type : "string", group : "Data", defaultValue : null},
				type			: {type : "string", group : "Data", defaultValue : "blog"},
				title 			: {type : "string", group : "Data", defaultValue : null},
				creationDate	: {type : "date", group : "Data", defaultValue : null},
				user			: {type : "com.team6.noblog.model.dao.User", group : "Data", defaultValue : null},
				posts			: {type : "com.team6.noblog.model.dao.Post[]", group : "Data", defaultValue : []}
			}
		},
		
		_oModel : null,
		
		constructor: function(oBlogModel) {
			this._oModel = oBlogModel;
			this._oModel.attachRequestCompleted(this._parseDataInModelContext, this);
		},
		
		getModel: function() {
			return this._oModel;
		},
		
		_parseDataInModelContext: function(oEvent) {
			var bSuccess = oEvent.getParameter("success");
			
			if( bSuccess ) {
				var oData = this._oModel.getData();
				console.log(oData);
			} else {
				throw new Error("Failed to load blog data!");
			}
		}
	});
	
	return Blog;
});