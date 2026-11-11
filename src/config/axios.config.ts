import axios from "axios";
import { differenceInSeconds } from "date-fns";
import jwtDecode from "jwt-decode";
import { API_ENDPOINTS } from "../shared/api-endpoint.shared";
import { environment } from "../environments/environment";

const API = axios.create({
  baseURL: environment.baseApiURL,
});

const refreshToken = async () => {
  const savedRefreshToken = sessionStorage.getItem("refresh_token"),
    state: any = sessionStorage.getItem("state"),
    statevar = JSON.parse(state);

  try {
    let result = await axios.post(
      `${environment.baseApiURL}${API_ENDPOINTS.AUTH_REFRESH_TOKEN}`,
      {
        refreshToken: savedRefreshToken,
        state: {
          uniqueid: statevar.uniqueid,
          ondemandpage: statevar.ondemandpage,
        },
      }
    );

    if (result.status === 201) {
      sessionStorage.setItem("access_token", result.data.data.access_token);
      return result.data.data.access_token;
    } else {
      sessionStorage.clear();
    }
  } catch (error: any) {
    if (error.response.data.code === 401) {
      sessionStorage.clear();
    }
  }
};

const getBearerToken = async () => {
  try {
    let token = sessionStorage.getItem("access_token");
    let decodedToken: any = token ? jwtDecode(token!) : "";
    if (
      differenceInSeconds(new Date(decodedToken.exp * 1000), new Date()) <= 0
    ) {
      return refreshToken();
    } else {
      return token;
    }
  } catch (error) {
    return error;
  }
};

API.interceptors.request.use(
  async (config) => {
    const token = await getBearerToken();
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(function (response) {
  return response;
});

export default API;
