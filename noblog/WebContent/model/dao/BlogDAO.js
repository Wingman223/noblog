
var _oBlogDAOInstance = null;

sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/model/json/JSONModel',
	'model/dao/BlogDTO',
	'model/Config'
], function (Object, JSONModel, BlogDTO, Config) {
	"use strict";
	
	var BlogDAO = Object.extend("com.team6.noblog.model.dao.BlogDAO", {
		
		constructor: function() {
			if( _oBlogDAOInstance ) {
				throw new Error("Only one instance of BlogDAO allowed! Please use getInstance method");
			} else {
				_oBlogDAOInstance = this;
			}
		},
		
		loadBlog: function(sId, fnCallback) {
			
			// Create DTO and start 
			var oModel 		= new JSONModel();
			var sUrl 		= Config.getDocument(sId);
			var oBlogDTO	= new BlogDTO(oModel);
			
			oBlogDTO.attachDataLoaded(function(oEvent) {
				console.log("Parsing data in DTOs completed!");
				if( fnCallback ) {
					fnCallback();
				}
			});
			oBlogDTO.attachDataError(function(oEvent) {
				console.log("Error while loading data");
			});
			
			oModel.loadData(sUrl);
			
			return oBlogDTO;
		},
		
		createBlog: function(oBlog) {
			
		},
		
		updateBlog: function(oBlog) {
			//TODO not implemented
		},
		
		removeBlog: function(sId) {
			//TODO not implemented
		}
	});
	
	com.team6.noblog.model.dao.BlogDAO.getInstance = function() {
		if( !_oBlogDAOInstance ) {
			new BlogDAO();
		}
		return _oBlogDAOInstance;
	};
	
	return BlogDAO;
});