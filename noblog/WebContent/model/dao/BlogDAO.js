
var _oBlogDAOInstance = null;

sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/model/json/JSONModel',
	'model/dao/Blog',
	'model/Config'
], function (Object, JSONModel, Blog, Config) {
	"use strict";
	
	var BlogDAO = Object.extend("com.team6.noblog.model.dao.BlogDAO", {
		
		constructor: function() {
			if( _oBlogDAOInstance ) {
				throw new Error("Only one instance of BlogDAO allowed! Please use getInstance method");
			} else {
				_oBlogDAOInstance = this;
			}
		},
		
		loadBlog: function(sId) {
			var oModel 	= new JSONModel();
			var oBlog	= new Blog(oModel);
			var sPath	= Config.getDocument(sId);
			
			oModel.loadData(sPath);
			
			return oBlog;
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