// import { UserLogged } from "@Common/types";
import { store } from "@App/store";
import axios from "axios";
// https://delivery-system.onrender.com
const api = axios.create({
  baseURL: "https://delivery-service-7elcupesca-uc.a.run.app/api/",
  headers: {
    "Content-type": "application/json",
  },
});

// const api = axios.create({
//   baseURL: "http://localhost:8080/api/",
//   headers: {
//     "Content-type": "application/json",
//   },
// });

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);

    if (error.response.status >= 300 && error.response.status <= 500) {
      delete error.response.data.data;
      return {
        ...error.response.data,
        status: error.response.status,
      };
    }
  }
);

api.interceptors.request.use(function (config): any {
  const token: string | undefined = store.getState().user.token;

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default api;
