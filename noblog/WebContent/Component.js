sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/m/routing/Router',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel',
	'model/dao/BlogDAO',
	'model/dao/UserDAO',
	'model/Config'
], function (UIComponent,
			Router,
			ResourceModel,
			ODataModel,
			JSONModel,
			BlogDAO,
			UserDAO) {

	return UIComponent.extend("com.team6.noblog.Component", {
		metadata: {
			routing: {
				config: {
					routerClass	: Router,
					viewType	: "XML",
					viewPath	: "view",
					controlId	: "splitApp",
					transition	: "slide",
					bypassed 	: {
						target: ["notFound"]
					}
				},
				routes: [
					{
						pattern		: "",
						name		: "home",
						target		: ["blogListView", "recentBlogPostsView"]
					},
					{
						pattern		: "blog/{id}",
						name		: "blog",
						target		: ["postListView", "blogPostsView"]
					},
					{
						pattern		: "blog/{id}/post/{index}",
						name		: "post",
						target		: ["postListView", "blogPostDetailView"]
					}
				],
				targets : {
					blogListView: {
						viewName: "master.BlogList",
						viewLevel: 1,
						controlAggregation: "masterPages"
					},
					postListView: {
						viewName: "master.PostList",
						viewLevel: 1,
						controlAggregation: "masterPages"
					},
					notFound: {
						viewName: "detail.NotFound",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					recentBlogPostsView : {
						viewName: "detail.RecentBlogPosts",
						viewLevel: 2,
						controlAggregation: "detailPages",
						transition: "show"
					},
					blogPostsView : {
						viewName: "detail.BlogPosts",
						viewLevel: 2,
						controlAggregation: "detailPages",
						transition: "show"
					},
					blogPostDetailView : {
						viewName: "detail.BlogPostDetail",
						viewLevel: 3,
						controlAggregation: "detailPages",
						transition: "slide"
					}
				}
			}
		},
		
		_oAppView 		: null,
		_oAppController : null,
		
		// ##########################################################################
		// ### INITIALIZATION

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			
			// Initialize models
			
			// I18N MODEL
			var oI18nModel = new ResourceModel({
				bundleUrl: "i18n/appTexts.properties"
			});
			this.setModel(oI18nModel, "i18n");

			// DEVICE MODEL
			var oDeviceModel = new JSONModel({
				isTouch		: sap.ui.Device.support.touch,
				isNoTouch	: !sap.ui.Device.support.touch,
				isPhone		: sap.ui.Device.system.phone,
				isNoPhone	: !sap.ui.Device.system.phone,
				listMode	: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");
			
			// initialize router
			this.getRouter().initialize()
		},
		
		createContent: function () {
			// create root view. Save view and controller instance for later use
			this._oAppView = sap.ui.view({
				viewName: "view.App",
				type	: "XML"
			});
			this._oAppController = this._oAppView.getController();
			
			// return view for display
			return this._oAppView;
		},
		
		// ##########################################################################
		// ### METHODS
		
		// ----------------------------------------------
		// APP
		
		// FIXME move to a different place maybe?
		// ---
		loadBlog: function(sId) {
			return this._oAppController.loadBlog(sId);
		},
		
		getBlogDTO: function() {
			return this._oAppController.getBlogDTO();
		},
		
		getBlog: function() {
			var oBlogDTO = this.getBlogDTO();
			return oBlogDTO.getBlog();
		},
		// ---
		
		getUserDTO: function() {
			return this._oAppController.getUserDTO();
		},
		
		getUser: function() {
			return this._oAppController.getUser();
		},
		
		showLoginPopup: function(oTarget) {
			this._oAppController.showLoginPopover(oTarget);
		},
		
		showUserDetailsPopover: function(oTarget) {
			this._oAppController.showUserDetailsPopover(oTarget);
		},
		
		// -----------------------------------------------
		
		getRouter: function() {
			return this._oRouter;
		},
		
		attachRouteMatched: function(sRoute, fnCallback, oInstance) {
			this._oRouter.getRoute(sRoute).attachMatched(fnCallback, oInstance);
		},
		
		navTo: function(sId, oData, bReplace) {
			this._oRouter.navTo(sId, oData, bReplace);
		},
		
		navBack: function() {
			var oHistory 	= sap.ui.core.routing.History.getInstance();
			var oPrevHash 	= oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this._oRouter.navTo("home", {}, true);
			}
		}
	});
});
