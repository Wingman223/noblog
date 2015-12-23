sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/m/routing/Router',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel',
	'model/Config'
], function (UIComponent,
			Router,
			ResourceModel,
			ODataModel,
			JSONModel,
			LoginController) {

	return UIComponent.extend("com.team6.noblog.Component", {