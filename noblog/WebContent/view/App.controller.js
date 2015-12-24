jQuery.sap.require("util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("model.dao.UserDAO");

sap.ui.controller("view.App", {
	
	_oLoginPopover : null,
	
	onInit: function() {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oUserDAO		= com.team6.noblog.model.dao.UserDAO.getInstance();
		
		this._oLoginPopover = sap.ui.xmlfragment("view.fragment.LoginPopover", this);
		this._oView.addDependent(this._oLoginPopover);
		
		// attach additional model to popover to prevent id conflicts
		var oModelPopover	= new sap.ui.model.json.JSONModel();
		oModelPopover.setData({
			username : "meinuser",
			password : "test"
		});
		this._oLoginPopover.setModel(oModelPopover, "login");
		this._oLoginPopover.bindElement("login>/");
	},
	
	// ###########################################################################
	// ### LOGIN POPOVER
	
	showLoginPopover : function(oTarget) {
		jQuery.sap.delayedCall(0, this, function () {
			this._oLoginPopover.openBy(oTarget);
		});
	},
	
	handleButtonLoginPressed: function(oEvent) {
		var oSource 	= oEvent.getSource();
		var oModel		= oSource.getModel("login");
		
		var sUsername 	= oModel.getProperty("/username");
		var sPassword	= oModel.getProperty("/password");
		
		this._oUserDAO.tryLogin(sUsername, sPassword, function(bSucceeded) {
			if( bSucceeded ) {
				sap.m.MessageBox.alert("You are now logged in!");
			} else {
				sap.m.MessageBox.alert("Login failed. Please check your username and password");
			}
		}.bind(this));
	},
	
	handleButtonRegisterPressed: function(oEvent) {
		
	}
	
	// ###########################################################################
});