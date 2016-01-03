
var _oBlogDAOInstance = null;

sap.ui.define([
	'model/dao/base/DAO',
	'sap/ui/model/json/JSONModel',
	'model/dao/BlogDTO',
	'model/dao/Blog',
	'model/Config'
], function (DAO, JSONModel, BlogDTO, Blog, Config) {
	"use strict";
	
	var BlogDAO = DAO.extend("com.team6.noblog.model.dao.BlogDAO", {
		
		constructor: function() {
			if( _oBlogDAOInstance ) {
				throw new Error("Only one instance of BlogDAO allowed! Please use getInstance method");
			} else {
				DAO.prototype.constructor.apply(this, arguments);
				_oBlogDAOInstance = this;
			}
		},
		
		loadBlog: function(sId, fnCallback) {
			
			// Create DTO and start 
			var sUrl 		= Config.getDocument(sId);
			var oModel 		= new JSONModel();
			var oBlogDTO	= new BlogDTO();
			
			oBlogDTO.setModel(oModel);
			oBlogDTO.load(sUrl);
			
			return oBlogDTO;
		},
		
		createBlog: function(oBlog, oUser, fnSuccess) {
			
			var sUrl		= Config.getDB("noblog");
			var sUsername	= oUser.getUsername();
			var sPassword	= oUser.getPassword();
			var oBlogDTO	= new BlogDTO();
			
			oBlogDTO.setBlog(oBlog);
			
			this._sendRequest(sUrl, DAO.REQUEST_TYPE.CREATE, oBlogDTO, sUsername, sPassword,
				function(oData, oRequest) {
					fnSuccess();
				}.bind(this)
			);
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