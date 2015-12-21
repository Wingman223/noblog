jQuery.sap.declare("model.Config");

model.Config = {};

/**
 * Service url for getBlogsLatest view
 */
model.Config.getBlogsServiceUrl = function() {
	return model.Config.getView("getBlogsLatest");
};

/**
 * Service url for getBlogsLatest view
 */
model.Config.getLatestBlogPostsServiceUrl = function() {
	return model.Config.getView("getLatestBlogEntries");
};

model.Config.getDocument = function(id) {
	return model.Config.getHost() + "/" + id;
};

/**
 * Path to view queries
 */
model.Config.getView = function(name) {
	return model.Config.getHost() + "/_design/query/view/" + name;
};

/**
 * Basic path to query view
 */
model.Config.getHost = function() {
	var iPort = jQuery.sap.getUriParameters().get("port");
	
	if( !iPort ) {
		iPort = 8081;
	}
	
	return "http://localhost:" + iPort + "/noblog";
};

/*
(function () {
	var responderOn = jQuery.sap.getUriParameters().get("responderOn");
	model.Config.isMock = ("true" === responderOn);
}
)();

model.Config.getUser = function () {
	
	return "ESPM_TEST";

};

model.Config.getPwd = function () {
	
	return "Espm1234";

};

model.Config.getHost = function () {
	
	return "../../../../../proxy/http/ec2-54-225-119-138.compute-1.amazonaws.com:50000";

};
*/