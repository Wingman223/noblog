sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Context'
], function (ManagedObject, JSONModel, Context) {
	"use strict";
	
	var DTO = ManagedObject.extend("com.team6.noblog.model.dao.base.DTO", {
		metadata : {
			events : {
				// event for callback when blog data is available
				dataLoaded : {
					
				},
				dataError : {
					
				},
				change : {
					
				}
			}
		},
		
		_oModel 	: null,
		_oContext 	: null,
		_oObject	: null,
		
		// #########################################################################################
		// ### PUBLIC
		
		/**
		 * You can use a model as data source to populate this DTO
		 */
		setModel: function(oModel, sPath, bDataNotLoaded) {
			// check if all required variables are filled
			if(!(oModel || sPath)) {
				throw new Error( this.constructor.name + " : Not all required fields are filled");
				return;
			}
			
			// set private properties
			this._oModel	= oModel;
			this._oContext 	= new Context(oModel, sPath);
			
			if(bDataNotLoaded) {
				// if data is not loaded, attach model event to wait for data to arrive
				this._oModel.attachRequestCompleted(function(oEvent) {
					var bSuccess = oEvent.getParameter("success");
					if( bSuccess ) {
						// Remove old event listener
						if(this._oObject) {
							this._oObject.detachChange(this._onDataChanged, this);
						}
						
						// Parse and set new object
						var oObject = this._mapServiceDataToDTO(this._oModel.getData());
						this._registerObject(oObject);
						
						// --- DEBUG --------------------------
						
						console.log("DTO.js : Parsing successfull!");
						console.log("Model data:");
						console.log(this._oModel.getData());
						console.log("DTO data:");
						console.log(this.getServiceData());
						
						// ------------------------------------
						
						this.fireDataLoaded({});
					} else {
						this._oObject = null;
						console.log("Couldn't load data");
						this.fireDataError({});
					}
				}, this);
			} else {
				// otherwise use data available in model
				var oObject = this._mapServiceDataToDTO(this._oContext.getObject());
				this._registerObject(oObject);
				
				this.fireDataLoaded({});
			}
		},
		
		/**
		 * You can use a matching DataObject to 
		 */
		setObject: function(oObject) {
			// check if all required variables are filled
			if(!this._checkDataObject(oObject)) {
				throw new Error( this.constructor.name + " : Provided data object is invalid");
				return;
			}
			
			var oData 			= this._mapDTOToServiceData(oObject);
			var oModel 			= new JSONModel(oData);
			
			this._oModel		= oModel;
			this._oContext		= new Context(this._oModel, "/");
			
			this._registerObject(oObject);
		},
		
		// FIXME quick solution for change problems. Needs refactoring
		_registerObject: function(oObject) {
			
			// Remove old event listener
			if(this._oObject) {
				this._oObject.detachChange(this._onDataChanged, this);
			}
			
			// Save data object and register new change listener
			this._oObject 		= oObject;
			this._oObject.attachChange(this._onDataChanged.bind(this));
		},
		
		load: function(sUrl, sUsername, sPassword) {
			if(this._oModel) {
				
				var oHeaders;
				
				// Add authentication if requested
				if( sUsername && sPassword ) {
					oHeaders = {
						Authorization : "Basic " + window.btoa(sUsername + ":" + sPassword)
					}
				}
				
				this._oModel.loadData(sUrl, null, true, "GET", false, false, oHeaders);
			}
		},
		
		refresh: function() {
			this._oObject = this._mapServiceDataToDTO();
		},

		getModel: function() {
			return this._oModel;
		},
		
		getPath: function() {
			return this._oContext.getPath();
		},
		
		getObject: function() {
			return this._oObject;
		},
		
		getServiceData: function() {
			return this._mapDTOToServiceData(this.getObject());
		},
		
		// #####################################################################
		// ### PRIVATE ABSTRACT
		
		/**
		 * Check if the data object provided matches the data object
		 * needed for this DTO
		 */
		_checkDataObject: function(oDataObject) {
			throw new Error("Method _checkDataObject must be overridden!");
		},
		
		/**
		 * Maps the raw js object provided by the model to an actual Data Object
		 */
		_mapServiceDataToDTO: function(oData) {
			throw new Error("Method _mapServiceDataToDTO must be overridden!");
		},
		
		/**
		 * Maps the data object back to the actual structure needed for the service
		 */
		_mapDTOToServiceData: function(oDTO) {
			throw new Error("Method _mapDTOToServiceData must be overridden!");
		},
		
		// #########################################################################################
		// ### PRIVATE
		
		/**
		 * Callback when data changed
		 */
		_onDataChanged: function(oEvent) {
			console.log("change");
			
			var oData = this._mapDTOToServiceData(this._oObject);
			this._oModel.setProperty(this._oContext.getPath(), oData);
			this._oModel.refresh();
		},
	});
	
	return DTO;
});