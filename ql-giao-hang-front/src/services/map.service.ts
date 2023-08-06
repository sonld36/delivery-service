import { LongLatData } from "@Components/MapFollowShipper";
import axios from "axios";

const getUrl = (location: string) => {
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw`;
};

const getUrlReverseGeocoding = (geocoding: LongLatData) => {
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${geocoding.longtitude},${geocoding.latitude}
  .json?access_token=pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw`;
};

const getDirectionUrl = (
  fromLocation: LongLatData,
  toLocation: LongLatData
) => {
  return `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${fromLocation.longtitude},${fromLocation.latitude};${toLocation.longtitude},${toLocation.latitude}?geometries=geojson&access_token=pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw`;
};

class MapService {
  async getCoordinate(location: string) {
    const url = getUrl(location);
    const resp = (await axios.get(url)).data;

    return resp.features.at(0).geometry.coordinates;
  }

  async getLocation(geocoding: LongLatData) {
    const url = getUrlReverseGeocoding(geocoding);
    const resp = (await axios.get(url)).data;
    return resp.features[0].place_name;
  }

  async getDirection(fromLocation: LongLatData, toLocation: LongLatData) {
    const url = getDirectionUrl(fromLocation, toLocation);
    const resp = (await axios.get(url)).data;
    return resp.routes[0];
  }
}

export default new MapService();
