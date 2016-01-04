jQuery.sap.require("util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("model.dao.UserDAO");
jQuery.sap.require("model.dao.UserDTO");
jQuery.sap.require("model.dao.User");

sap.ui.controller("view.App", {
	
	_oComponent					: null,
	_oView						: null,
	
	// DAO/DTO
	_oBlogDAO					: null,
	_oBlogDTO					: null,
	
	_oUserDAO					: null,
	_oUserDTO					: null,
	
	// LoginPopover
	_oLoginPopover 				: null,
	_oLoginPopoverNavContainer 	: null,
	
	onInit: function() {
		this._oComponent 	= this.getOwnerComponent();
		this._oView			= this.getView();
		this._oBlogDAO 		= com.team6.noblog.model.dao.BlogDAO.getInstance();
		this._oUserDAO 		= com.team6.noblog.model.dao.UserDAO.getInstance();
		
		this._initAuthentication();
		this._initLoginPopover();
	},
	
	// ###########################################################################
	// ### SHARED BLOG DOCUMENT DATA
	
	loadBlog: function(sId) {
		this._oBlogDTO 	= this._oBlogDAO.loadBlog(sId);
		var oModel		= this._oBlogDTO.getModel();
		
		this._oView.setModel(oModel, "global_blog_model");
		
		return this._oBlogDTO;
	},
	
	getBlogDTO: function() {
		return this._oBlogDTO;
	},
	
	getBlog: function() {
		var oBlogDTO = this.getBlogDTO();
		return oBlogDTO.getBlog();
	},
	
	// ###########################################################################
	// ### AUTHENTICATION
	
	_initAuthentication : function() {
		this._resetAuthenticationModel();
	},
	
	login: function(sUsername, sPassword, fnCallback) {
		this._oUserDAO.tryLogin(sUsername, sPassword,
			function(oUserDTO) {
				var oUser	= oUserDTO.getUser();
				var oModel 	= this._getAuthenticationModel();
				oModel.setProperty("/isLoggedIn", true);
				oModel.setProperty("/username"	, oUser.getUsername());
				oModel.setProperty("/user"		, oUserDTO);
			}.bind(this),
			function(oError) {
				sap.m.MessageBox.alert("Login failed. Username or Password wrong");
			}.bind(this)
		);
		
		this._oLoginPopover.close();
	},
	
	logout: function() {
		this._resetAuthenticationModel();
	},
	
	register: function(oUser) {
		this._oUserDAO.createUser(oUser,
			function(oData, oRequest) {
				sap.m.MessageBox.alert("User successfully registered");
			},
			function(oError) {
				sap.m.MessageBox.alert("Could not register user");
			}
		);
	},
	
	getUserDTO: function() {
		var oModel 		= this._getAuthenticationModel();
		var oUserDTO	= oModel.getProperty("/user");
		
		return oUserDTO;
	},
	
	getUser: function() {
		var oUserDTO = this.getUserDTO();
		return oUserDTO.getUser();
	},
	
	_getAuthenticationModel: function() {
		return this._oView.getModel("authentication");
	},
	
	_resetAuthenticationModel : function() {
		var oModel 	= new sap.ui.model.json.JSONModel({
			isLoggedIn  : false,
			username	: "",
			user		: null
		});
		this._oView.setModel(oModel, "authentication");
	},
	
	// ###########################################################################
	// ### LOGIN POPOVER
	
	_initLoginPopover : function() {
		
		// Init LoginPopover and all of its dependencies
		this._oLoginPopover 			= sap.ui.xmlfragment("view.fragment.LoginPopover", this);
		this._oLoginPopoverNavContainer = sap.ui.getCore().byId("id_loginpopover_navcontainer");
		
		// Create model for popover to get data
		this._resetLoginPopoverModel();
		
		// set model and attach events and lifecycle
		this._oLoginPopover.attachAfterClose(this.onAfterLoginPopoverClosed, this);
		this._oView.addDependent(this._oLoginPopover);
	},
	
	_resetLoginPopoverModel : function() {
		var oModelPopover	= new sap.ui.model.json.JSONModel({
			login : {
				username : "meinuser",
				password : "test"
			},
			register : {
				username 	: "",
				password 	: "",
				prename		: "",
				surname		: "",
				email		: ""
			}
		});
		
		this._oLoginPopover.setModel(oModelPopover, "loginpopover");
	},
	
	showLoginPopover : function(oTarget) {
		jQuery.sap.delayedCall(0, this, function () {
			this._oLoginPopover.openBy(oTarget);
		});
	},
	
	handleButtonLoginPressed: function(oEvent) {
		var oSource 	= oEvent.getSource();
		var oModel		= oSource.getModel("loginpopover");
		
		var sUsername 	= oModel.getProperty("/login/username");
		var sPassword	= oModel.getProperty("/login/password");
		
		this.login(sUsername, sPassword);
	},
	
	handleLinkRegisterClicked: function(oEvent) {
		this._oLoginPopoverNavContainer.to("id_loginpopover_navcontainer_register");
	},
	
	handleButtonBackPressed: function(oEvent) {
		this._oLoginPopoverNavContainer.back();
	},
	
	handleButtonRegisterPressed: function(oEvent) {
		var oSource 	= oEvent.getSource();
		var oModel		= oSource.getModel("loginpopover");
		
		var sUsername 	= oModel.getProperty("/register/username");
		var sPassword	= oModel.getProperty("/register/password");
		var sPrename 	= oModel.getProperty("/register/prename");
		var sSurname	= oModel.getProperty("/register/surname");
		var sEmail 		= oModel.getProperty("/register/email");
		
		var oUser = new com.team6.noblog.model.dao.User(sUsername, sPassword, sPrename, sSurname, sEmail);
		this.register(oUser);
		
		this._oLoginPopover.close();
	},
	
	onAfterLoginPopoverClosed: function(oEvent) {
		this._resetLoginPopoverModel();
		this._oLoginPopoverNavContainer.backToTop();
	},
	
	// ###########################################################################
	// ### USER DETAILS POPOVER
	
	showUserDetailsPopover : function(oTarget) {
		
		if(!this._oUserDetailsPopover) {
			this._oUserDetailsPopover = sap.ui.xmlfragment("view.fragment.UserDetailsPopover", this);
			this._oView.addDependent(this._oUserDetailsPopover);
		}
		
		jQuery.sap.delayedCall(0, this, function () {
			this._oUserDetailsPopover.openBy(oTarget);
		});
	},
	
	handleButtonLogoutPressed: function(oEvent) {
		var oSource 	= oEvent.getSource();
		
		this.logout();
		this._oUserDetailsPopover.close();
	}
	
	// ###########################################################################
});