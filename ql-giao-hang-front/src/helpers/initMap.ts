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
    zoom: 4.5,
    accessToken:
      "pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw",
    doubleClickZoom: false,
  });
  map.on("load", function () {
    map.resize();
  });

  return map;
};
