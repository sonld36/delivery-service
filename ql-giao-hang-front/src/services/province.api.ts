import axios from "axios";

const provinceApi = axios.create({
  baseURL: "https://provinces.open-api.vn/api",
  headers: {
    "Content-type": "application/json",
  },
});

provinceApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status >= 300 && error.response.status < 500) {
      delete error.response.data.data;
      return {
        ...error.response.data,
        status: error.response.status,
      };
    }
  }
);

export default provinceApi;
