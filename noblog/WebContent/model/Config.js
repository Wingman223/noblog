jQuery.sap.declare("model.Config");

model.Config = {};

/**
 * Service url for getBlogsLatest view
 */
model.Config.getBlogsServiceUrl = function() {
	return model.Config.getHost() + "/getBlogsLatest";
};

/**
 * Service url for getBlogsLatest view
 */
model.Config.getLatestBlogPostsServiceUrl = function() {
	return model.Config.getHost() + "/getLatestBlogEntries";
};

/**
 * Basic path to query view
 */
model.Config.getHost = function() {
	var iPort = jQuery.sap.getUriParameters().get("port");
	
	if( !iPort ) {
		iPort = 8081;
	}
	
	return "http://localhost:" + iPort + "/noblog/_design/query/_view";
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