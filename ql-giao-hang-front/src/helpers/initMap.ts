import { Map } from "mapbox-gl";

export const initMap = (
  container: HTMLDivElement,
  coords: [number, number]
) => {
  const map = new Map({
    container,
    style: "mapbox://styles/mapbox/outdoors-v12",
    pitchWithRotate: false,
    center: coords,
    zoom: 15,
    accessToken:
      "pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw",
    doubleClickZoom: false,
  });
  map.on("load", function () {
    map.resize();

    map.loadImage(
      "https://img.icons8.com/?size=512&id=m4nICevrL3ps&format=png",
      (error, image) => {
        if (error) throw error;
        map.addImage("carrier", image ?? new HTMLImageElement());
      }
    );

    map.addSource("iss", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: coords,
            },
            properties: {},
          },
        ],
      },
    });
    // Add the rocket symbol layer to the map.
    map.addLayer({
      id: "iss",
      type: "symbol",
      source: "iss",
      layout: {
        // This icon is a part of the Mapbox Streets style.
        // To view all images available in a Mapbox style, open
        // the style in Mapbox Studio and click the "Images" tab.
        // To add a new image to the style at runtime see
        // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
        "icon-image": "carrier",
        "icon-size": 0.08,
      },
    });

    map.flyTo({
      center: coords,
      speed: 0.5,
    });
  });

  return map;
};
