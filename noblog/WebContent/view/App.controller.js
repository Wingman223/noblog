jQuery.sap.require("util.Formatter");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("view.App", {
	
	_oLoginPopover : null,
	
	onInit: function() {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		
		this._oLoginPopover = sap.ui.xmlfragment("view.fragment.LoginPopover", this);
		this._oView.addDependent(this._oLoginPopover);
	},
	
	// ###########################################################################
	// ### LOGIN POPOVER
	
	showLoginPopover : function(oTarget) {
		jQuery.sap.delayedCall(0, this, function () {
			this._oLoginPopover.openBy(oTarget);
		});
	},
	
	handlePress: function(oEvent) {
		console.log(oEvent);
	}
	
	// ###########################################################################
});