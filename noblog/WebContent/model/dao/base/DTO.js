sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/model/Context'
], function (ManagedObject, Context) {
	"use strict";
	
	var DTO = ManagedObject.extend("com.team6.noblog.model.dao.base.DTO", {
		metadata : {
			events : {
				// event for callback when blog data is available
				dataLoaded : {
					
				},
				dataError : {
					
				}
			}
		},
		
		_oModel 	: null,
		_oContext 	: null,
		
		constructor: function(oModel, sPath, bDataNotLoaded) {
			ManagedObject.prototype.constructor.apply(this);
			
			// check if all required variables are filled
			if(!(oModel || sPath)) {
				throw new Error( this.constructor.name + " : Not all required fields are filled");
				return;
			}
			
			// set private properties
			this._oModel	= oModel;
			this._oContext 	= this.createBindingContext(oModel, sPath);
			
			if(bDataNotLoaded) {
				// if data is not loaded, attach model event to wait for data to arrive
				this._oModel.attachRequestCompleted(this._parseDataInModelContext, this);
			} else {
				// otherwise use data available in model
				this._mapServiceDataToDTO(this._oContext.getObject());
			}
		},
		
		_parseDataInModelContext: function(oEvent) {
			var bSuccess = oEvent.getParameter("success");
			if( bSuccess ) {
				this._mapServiceDataToDTO(this._oModel.getData(), true);
				
				console.log("DTO.js : Parsing successfull!");
				console.log("Model data:");
				console.log(this._oModel.getData());
				console.log("DTO data:");
				console.log(this.getServiceData());
				
				this.fireDataLoaded({});
			} else {
				this.fireDataError({});
			}
		},
		
		getPath: function() {
			return this._oContext.getPath();
		},
		
		getModel: function() {
			return this._oModel;
		},
		
		getServiceData: function() {
			return this._mapDTOToServiceData();
		},
		
		createBindingContext: function(oModel, sPath) {
			return new Context(oModel, sPath);
		},
		
		getIndexFromPath : function(sPath) {
			return sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
		},
		
		_mapServiceDataToDTO: function(oData) {
			throw new Error("Method _mapServiceDataToDTO must be overridden!");
		},
		
		_mapDTOToServiceData: function() {
			throw new Error("Method _mapDTOToServiceData must be overridden!");
		}
	});
	
	return DTO;
});