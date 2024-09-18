sap.ui.define(['sap/m/MessageToast', 'sap/ui/export/Spreadsheet', 'sap/ui/export/library'], function (MessageToast, Spreadsheet, exportLibrary) {
  'use strict';
  var EdmType = exportLibrary.EdmType;
  return {
    onInit: function () {
      this.extensionAPI.attachPageDataLoaded(this.onDetailsLoaded, this);
      console.log('OnInit');
    },

    onBeforeRendering: function () {
      console.log('onBeforeRendering');
    },

    onAfterRendering: function () {
      console.log('onAfterRendering');
    },

    onValueHelpRequest: function (event) {
      var sPath = event.context.sPath; // has the context path
      var contextObj = event.context.getObject(); //contains the context Object and has all the properties bound in the list report Item
    },

    onDetailsLoaded: function (event) {
      MessageToast.show('onDetailsLoaded invoked.');
      var sPath = event.context.sPath; // has the context path

      var contextObj = event.context.getObject(); //contains the context Object and has all the properties bound in the list report Item
    },
    createColumnConfig: function () {
      var aCols = [];

      var aColumns = [];
      aColumns.push({
        label: 'Name',
        property: 'name',
      });
      aColumns.push({
        label: 'Value',
        property: 'value',
      });
      return aColumns;
    },
    onPressExcelExport: function (oEvent) {
      MessageToast.show('Custom handler invoked.');
      var aCols,
        oRowBinding = [],
        oSettings,
        oSheet;
      aCols = this.createColumnConfig();
      var bindingContext = oEvent.getSource().getParent().getParent().getBindingContext();
      var oModel = bindingContext.getModel();
      var sPath = bindingContext.getPath();
      var filters1 = new Array();
      var object = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
      filters1.push(new sap.ui.model.Filter('IsActiveEntity', sap.ui.model.FilterOperator.EQ, object.IsActiveEntity));
      filters1.push(new sap.ui.model.Filter('uuid', sap.ui.model.FilterOperator.EQ, object.uuid));
      oModel.read(sPath, {
        filters: filters1,
        urlParameters: { $expand: 'to_CandidateEducation' },
        success: function (data, response) {
          console.log(response), console.log(data);
          for (const property in data) {
            console.log(`${property}: ${object[property]}`);
            oRowBinding.push({ name: property, value: object[property] });
          }
          for (const property in data.to_CandidateEducation) {
            console.log(`${property}: ${object[property]}`);
            oRowBinding.push({ name: property, value: object[property] });
          }
        },
      });

      oSettings = {
        workbook: {
          columns: aCols,
          hierarchyLevel: 'Level',
          context: {
            application: 'Debug Test Application',
            version: '${version}',
            title: 'Some random title',
            modifiedBy: 'John Doe',
            metaSheetName: 'Custom metadata',
            metainfo: [
              {
                name: 'Grouped Properties',
                items: [
                  { key: 'administrator', value: 'Foo Bar' },
                  { key: 'user', value: 'John Doe' },
                  { key: 'server', value: 'server.domain.local' },
                ],
              },
              {
                name: 'Another Group',
                items: [
                  { key: 'property', value: 'value' },
                  { key: 'some', value: 'text' },
                  { key: 'fu', value: 'bar' },
                ],
              },
            ],
          },
        },
        dataSource: oRowBinding,
        fileName: 'Candidate.xlsx',
      };

      oSheet = new Spreadsheet(oSettings);

      oSheet
        .build()
        .then(function () {
          console.log('Export is finished');
        })
        .catch(function (sMessage) {
          console.log(sMessage);
        })
        .finally(function () {
          oSheet.destroy();
        });
    },
    ExportToExcell: function (oEvent) {
      MessageToast.show('Custom handler invoked.');
      oModel.read(sPath, {
        filters: filters1,
        urlParameters: { $expand: 'to_CandidateEducation' },
        success: function (data, response) {
          console.log(response), console.log(data);
          for (const property in data) {
            console.log(`${property}: ${object[property]}`);
            oRowBinding.push({ name: property, value: object[property] });
          }
          for (const property in data.to_CandidateEducation) {
            console.log(`${property}: ${object[property]}`);
            oRowBinding.push({ name: property, value: object[property] });
          }
        },
      });
    },
  };
});
