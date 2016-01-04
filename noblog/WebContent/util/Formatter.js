jQuery.sap.declare("util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("model.Config");

util.Formatter = {
	dateMedium: function(iDate) {
		var oDate		= new Date(iDate);
		var oFormatter 	= sap.ui.core.format.DateFormat.getDateTimeInstance({ style : 'medium' });
		
		return oFormatter.format(oDate);
	}
};