import {
  MenuLeft,
  Nav,
  ExperimentalMenu
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
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
  window.selectBaseMap = function(baseMap) {
    props.terria.mainViewer.setBaseMap(baseMap.mappable);

    if (baseMap.mappable) {
      const baseMapId = baseMap.mappable.uniqueId;
      if (baseMapId) {
        props.terria.setLocalProperty("basemap", baseMapId);
      }
    }
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
