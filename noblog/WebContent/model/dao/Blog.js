sap.ui.define([
	'sap/ui/base/ManagedObject',
	'model/dao/Post',
	'model/dao/User'
], function (ManagedObject, Post, User) {
	"use strict";
	
	var Blog = ManagedObject.extend("com.team6.noblog.model.dao.Blog", {
		metadata : {
			properties : {
				blogid 			: {type : "string", group : "Data", defaultValue : null},
				type			: {type : "string", group : "Data", defaultValue : "blog"},
				title 			: {type : "string", group : "Data", defaultValue : null},
				creationDate	: {type : "object", group : "Data", defaultValue : null}
			},
			aggregations : {
				user			: {type : "com.team6.noblog.model.dao.User", multiple : false},
				posts			: {type : "com.team6.noblog.model.dao.Post", multiple : true, singularName : "post"}
			}
		},
		
		_oModel : null,
		
		constructor: function(oBlogModel) {
			ManagedObject.prototype.constructor.apply(this);
			
			console.log(this);
			
			this._oModel = oBlogModel;
			this._oModel.attachRequestCompleted(this._parseDataInModelContext, this);
		},
		
		getModel: function() {
			return this._oModel;
		},
		
		_parseDataInModelContext: function(oEvent) {
			var bSuccess = oEvent.getParameter("success");
			
			if( bSuccess ) {
				var oData 		= this._oModel.getData();
				this._mapServiceDataToBlogDTA(oData);
				
				var oParsedData = this._mapBlogDTAToServiceData();
				console.log(oData);
				console.log(oParsedData);
			} else {
				throw new Error("Failed to load blog data!");
			}
		},
		
		getServiceData: function() {
			return this._mapBlogDTAToServiceData();
		},
		
		_mapServiceDataToBlogDTA: function(oData) {
			// map properties from service to dta
			this.setProperty("blogid"		, oData["_id"]);
			this.setProperty("type"			, oData["type"]);
			this.setProperty("creationDate"	, new Date(oData["creationDate"]));
			this.setProperty("title"		, oData["title"]);
			
			// map userid and username to user dta
			this.setAggregation("user"		, new User(oData));
			
			// map posts to post dta
			var aPosts = oData["posts"];
			for( var i=0; i<aPosts.length; i++ ) {
				this.addAggregation("posts", new Post(aPosts[i]))
			}
		},
		
		_mapBlogDTAToServiceData: function() {
			// Get blog and user data
			var oData = {
				_id 			: this.getBlogid(),
				type			: this.getType(),
				title			: this.getTitle(),
				creationDate	: this.getCreationDate(),
				posts			: []
			};
			var oUser 	= this.getUser().getServiceData();
			
			// Merge them together
			jQuery.sap.extend(oData, oUser);
			
			// Add posts afterwards
			var aPosts 	= this.getPosts();
			for( var i=0; i<aPosts.length; i++ ) {
				oData.posts.push(aPosts[i].getServiceData());
			}
			
			return oData;
		}
	});
	
	return Blog;
});