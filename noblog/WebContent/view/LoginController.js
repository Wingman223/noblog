sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/core/Fragment'
], function (Object, Fragment) {
	return Object.extend("com.team6.noblog.Component", {
		
		_popover: null,
		
		constructor: function() {
			this._popover = sap.ui.xmlfragment("view.popover.LoginPopover");
			this._popover.setPlacement("Bottom");
		},
		
		show: function(oTarget) {
			this._popover.openBy(oTarget);
		}
	})
});