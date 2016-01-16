jQuery.sap.declare("util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("model.Config");

util.Formatter = {
	allowedToCreatePosts: function(bLoggedIn, sUsername, sUserInline) {
		
		var bCreateVisible = false;
		if( bLoggedIn ) {
			if( sUsername == sUserInline ) {
				bCreateVisible = true;
			}
		}
		
		return bCreateVisible;
	},
	
	dateMedium: function(iDate) {
		var oDate		= new Date(iDate);
		var oFormatter 	= sap.ui.core.format.DateFormat.getDateTimeInstance({ style : 'medium' });
		
		return oFormatter.format(oDate);
	}
};