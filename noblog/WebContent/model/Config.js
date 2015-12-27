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

/**
 * Url to get information about a specific user
 * @param sUsername
 * @returns {String}
 */
model.Config.getUser = function(sUserid) {
	return model.Config.getDB("_users") + sUserid;
};

/**
 * Url to get a specific document in noblog db
 */
model.Config.getDocument = function(id) {
	return model.Config.getDB("noblog") + "/" + id;
};

/**
 * Path to view queries
 */
model.Config.getView = function(name) {
	return model.Config.getDB("noblog") + "/_design/query/_view/" + name;
};

/**
 * Path to db
 * 
 * @param sDBName Name of the db you want to access
 * @returns {String}
 */
model.Config.getDB = function(sDBName) {
	return model.Config.getHost() + "/" + sDBName;
};

/**
 * Basic host path to access
 */
model.Config.getHost = function() {
	var iPort = jQuery.sap.getUriParameters().get("port");
	
	if( !iPort ) {
		iPort = 8081;
	}
	
	return "http://localhost:" + iPort;
};