import axios from "axios";

const getUrl = (location: string) => {
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw`;
};

class MapService {
  async getCoordinate(location: string) {
    const url = getUrl(location);
    const resp = (await axios.get(url)).data;

    return resp.features.at(0).geometry.coordinates;
  }
}

export default new MapService();
