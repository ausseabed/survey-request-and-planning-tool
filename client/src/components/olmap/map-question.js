window.$ = window.jQuery = require('jquery');
const Survey = require('survey-vue');
import OlMap from './olmap'

function init(Survey) {
  var widget = {
    name: "olmap",
    title: "Map",
    iconName: "icon-barrating",
    widgetIsLoaded: function () {
      //return typeof $ === "function" && !!$.fn.olmap;
      return typeof OlMap != "undefined";
    },
    defaultJSON: {},
    isFit: function (question) {
      return question.getType() === "olmap";
    },
    isDefaultRender: true,
    htmlTemplate: "<div class='map' id='mapdiv' style='width: 100%; height: 100%'><div>",
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass("olmap", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("olmap", [
        { name: "basemap", default: "osm" },
        { name: "width:number", default: null },
        { name: "height:number", default: 400 }
      ]);
    },
    afterRender: function (question, el) {
      // Create map
      var $el = $(el).is(".map") ? $(el) : $(el).find(".map");

      $el.width(question.width);
      $el.height(question.height);
      
      var olmap = OlMap($el.get(0), {
        basemap: question.basemap
      })

      // Event handler to set answer to question on feature addition
      olmap.onAdd = function () {
        var data = olmap.get();
        question.value = data;
      };

      // Init
      olmap.initMap();

      // Handle update to question value, set the value on map
      var updateValueHandler = function () {
        olmap.clear();
        olmap.set(question.value);
      };
      question.valueChangedCallback = updateValueHandler;
      updateValueHandler();
      question.olmap = olmap;
    },
    willUnmount: function (question, el) {
      // Destroy element on unmount
      question.olmap.destroy();
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
