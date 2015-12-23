sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/m/routing/Router',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel',
	'view/LoginController'
], function (UIComponent,
			Router,
			ResourceModel,
			ODataModel,
			JSONModel,
			LoginController) {

	return UIComponent.extend("com.team6.noblog.Component", {
		metadata: {
			routing: {
				config: {
					routerClass	: Router,
					viewType	: "XML",
					viewPath	: "view",
					controlId	: "splitApp",
					transition	: "show",
					bypassed 	: {
						target: ["blogListView", "recentBlogPostsView", "notFound"]
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
						target		: ["postListView", "blogPostsView"],
					},
					{
						pattern		: "blog/{id}/post/{index}",
						name		: "post",
						target		: "blogPostDetailView"
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
						controlAggregation: "masterPages",
						transition: "slide"
					},
					notFound: {
						viewName: "detail.NotFound",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					recentBlogPostsView : {
						viewName: "detail.RecentBlogPosts",
						viewLevel: 2,
						controlAggregation: "detailPages"
					},
					blogPostsView : {
						viewName: "detail.BlogPosts",
						viewLevel: 2,
						controlAggregation: "detailPages",
						transition: "fade"
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
		
		// ##########################################################################
		// ### INITIALIZATION

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			
			// get router and set initial page
			var oRouter = this.getRouter();
			oRouter.getTargets().display("recentBlogPostsView");

			// now initialize hime
			oRouter.initialize();
		},
		
		createContent: function () {

			// set i18n model
			var oI18nModel = new ResourceModel({
				bundleUrl: "i18n/appTexts.properties"
			});
			sap.ui.getCore().setModel(oI18nModel, "i18n");

			// create root view
			this._oView = sap.ui.view({
				viewName: "view.App",
				type	: "XML"
			});
			this._oView.setModel(oI18nModel, "i18n");
			
			// get config
			jQuery.sap.require("model.Config");

			// set device model
			var oDeviceModel = new JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			oDeviceModel.setDefaultBindingMode("OneWay");
			this._oView.setModel(oDeviceModel, "device");

			// done
			return this._oView;
		},
		
		// ##########################################################################
		// ### METHODS
		
		showLoginPopup: function(oTarget) {
			var oLogin = new LoginController();
			oLogin.show(oTarget);
		},
		
		getView: function() {
			return this._oView;
		},
		
		getRouter: function() {
			return this._oRouter;
		},
		
		setModel: function(oModel, sName) {
			this._oView.setModel(oModel, sName);
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
