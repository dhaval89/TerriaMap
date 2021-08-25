import {
  MenuLeft,
  Nav,
  ExperimentalMenu
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import { runInAction } from "mobx";
import DefaultTimelineModel from "terriajs/lib/Models/DefaultTimelineModel";
import MeasureTool from "terriajs/lib/ReactViews/Map/Navigation/MeasureTool";
import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "./RelatedMaps";
import SplitPoint from "terriajs/lib/ReactViews/SplitPoint";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx";
import version from "../../version";

import "./global.scss";

// function loadAugmentedVirtuality(callback) {
//   require.ensure(
//     "terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool",
//     () => {
//       const AugmentedVirtualityTool = require("terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool");
//       callback(AugmentedVirtualityTool);
//     },
//     "AugmentedVirtuality"
//   );
// }

// function isBrowserSupportedAV() {
//   return /Android|iPhone|iPad/i.test(navigator.userAgent);
// }

export default function UserInterface(props) {
  const aboutEnabled = props.terria.configParameters.aboutEnabled;
  const relatedMapsEnabled = props.terria.configParameters.relatedMapsEnabled;

  function sendEventToDevice(event) {
    var ifrm = document.createElement("IFRAME");
    ifrm.setAttribute("src", "js-frame:" + event);
    document.documentElement.appendChild(ifrm);
    ifrm.parentNode.removeChild(ifrm);
    ifrm = null;
  }

  const eventArray = {
    onClick: function(next) {
      if (
        props.terria.mainViewer._lastViewer &&
        props.terria.mainViewer._lastViewer.scene &&
        props.terria.mainViewer._lastViewer.scene.map &&
        props.terria.mainViewer._lastViewer.scene.map._events &&
        props.terria.mainViewer._lastViewer.scene.map._events.click
      ) {
        var newPickLocation =
          props.terria.mainViewer._lastViewer.scene.map._events.click[0].fn;
        props.terria.mainViewer._lastViewer.scene.map._events.click[0].fn = function(
          e
        ) {
          console.log("new Pratik");
          newPickLocation(e);
          sendEventToDevice("onClick");
        };
      } else if (next) {
        next(next);
      }
    },
    move: function(next) {
      if (
        props.terria.mainViewer._lastViewer &&
        props.terria.mainViewer._lastViewer.scene &&
        props.terria.mainViewer._lastViewer.scene.map &&
        props.terria.mainViewer._lastViewer.scene.map._events &&
        props.terria.mainViewer._lastViewer.scene.map._events.move
      ) {
        var newPickLocation =
          props.terria.mainViewer._lastViewer.scene.map._events.move[0].fn;
        props.terria.mainViewer._lastViewer.scene.map._events.move[0].fn = function(
          e
        ) {
          console.log("move Pratik");
          newPickLocation(e);
          sendEventToDevice("move");
        };
      } else if (next) {
        next(next);
      }
    },
    zoomend: function(next) {
      if (
        props.terria.mainViewer._lastViewer &&
        props.terria.mainViewer._lastViewer.scene &&
        props.terria.mainViewer._lastViewer.scene.map &&
        props.terria.mainViewer._lastViewer.scene.map._events &&
        props.terria.mainViewer._lastViewer.scene.map._events.zoomend
      ) {
        var newPickLocation =
          props.terria.mainViewer._lastViewer.scene.map._events.zoomend[0].fn;
        props.terria.mainViewer._lastViewer.scene.map._events.zoomend[0].fn = function(
          e
        ) {
          console.log("zoomend Pratik");
          newPickLocation(e);
          sendEventToDevice("zoomend");
        };
      } else if (next) {
        next(next);
      }
    }
  };

  function triggerAllEvents() {
    for (const key in eventArray) {
      if (Object.hasOwnProperty.call(eventArray, key)) {
        const element = eventArray[key];
        const newFunc = function(next) {
          setTimeout(function() {
            element(next);
          }, 1000);
        };
        newFunc(newFunc);
      }
    }
  }

  triggerAllEvents();

  props.terria.locationService = function(zoomToLocation) {
    /*
    My location code
     */
    window.zoomToMyLocation = function(latitude, longitude, error = undefined) {
      if (latitude !== undefined && longitude !== undefined) {
        zoomToLocation({
          coords: {
            latitude: latitude,
            longitude: longitude
          }
        });
      } else if (error !== undefined) {
        //Show alert
      }
    };
    $.ajax({
      url: "./getLocation",
      method: "POST",
      success: function(result) {
        if (result.isSuccess !== undefined && result.isSuccess === true) {
          window.zoomToMyLocation(result.latitude, result.longitude);
        } else if (result.message !== undefined) {
          //Show alert
        }
      }
    });
  };

  /*
    Go to coordinate code
     */
  props.terria.gotoCoordinate = function(gotoCoordinate) {
    window.gotoCoordinate = function(latitude, longitude) {
      gotoCoordinate(latitude, longitude);
    };
  };

  props.terria.getCenterLatLong = function(getCenterLatLong) {
    window.getCenterLatLong = function() {
      return getCenterLatLong();
    };
  };

  /**
   *
   * @param {Object} baseMap : viewState.terria.baseMaps[index]
   * Change index to update map type, refer baseMaps array for more details
   * @use : selectBaseMap(viewState.terria.baseMaps[0])
   */
  const mapTypes = {
    "Bing Maps Aerial with Labels": "basemap-bing-aerial-with-labels",
    "Bing Maps Aerial": "basemap-bing-aerial",
    "Bing Maps Roads": "basemap-bing-roads",
    "Natural Earth 2": "basemap-natural-earth-II",
    "NASA Black Marble": "basemap-black-marble",
    "Postitron(Light)": "basemap-positron",
    "Dark Matter": "basemap-darkmatter",
    "Here Terrain": "basemap-here-terrain",
    "Here Satellite": "basemap-here-satellite",
    "Thunderforest Outdoors": "basemap-thunderforest-outdoors",
    "Thunderforest Transport Dark": "basemap-thunderforest-transport-dark",
    "ESRI World Imagenary Basemap": "basemap-esri-world-imagery-basemap",
    "ESRI Shaded Relief Basemap": "basemap-esri-shaded-relief",
    "ESRI World Street Map Basemap": "basemap-esri-world-street-map",
    "ESRI NatGeo World Map Basemap": "basemap-esri-natGeo-world-map"
  };
  /**
   *
   * @param {} mapJson
   */
  function getBaseMap(maptype) {
    const basemaps = props.viewState.terria.baseMaps;
    for (let i = 0; i < basemaps.length; i++) {
      if (basemaps[i].mappable.uniqueId == mapTypes[maptype]) {
        return basemaps[i];
      }
    }
  }
  window.selectBaseMap = function(mapJson) {
    const baseMap = getBaseMap(mapJson.maptype);
    props.terria.mainViewer.setBaseMap(baseMap.mappable);

    if (baseMap.mappable) {
      const baseMapId = baseMap.mappable.uniqueId;
      if (baseMapId) {
        props.terria.setLocalProperty("basemap", baseMapId);
      }
    }
  };

  window.changeTimeline = function(flag) {
    runInAction(() => {
      if (flag) {
        props.terria.timelineStack.defaultTimeVarying = new DefaultTimelineModel();
      } else {
        props.terria.timelineStack.defaultTimeVarying = undefined;
      }
    });
  };

  return (
    <StandardUserInterface {...props} version={version}>
      <MenuLeft>
        <If condition={relatedMapsEnabled}>
          <RelatedMaps viewState={props.viewState} />
        </If>
        <If condition={aboutEnabled}>
          <MenuItem caption="About" href="about.html" key="about-link" />
        </If>
      </MenuLeft>
      <Nav>
        <MeasureTool terria={props.viewState.terria} key="measure-tool" />
      </Nav>
      <ExperimentalMenu>
        {/* <If condition={isBrowserSupportedAV()}>
          <SplitPoint
            loadComponent={loadAugmentedVirtuality}
            viewState={props.viewState}
            terria={props.viewState.terria}
            experimentalWarning={true}
          />
        </If> */}
      </ExperimentalMenu>
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
