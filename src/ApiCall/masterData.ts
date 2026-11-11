import { API_ENDPOINTS } from "../shared/api-endpoint.shared";
import API from "../config/axios.config";

export const skillsMasterData = async (params) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_SKILL_MASTER_DATA, params);
    return data.data;
  } catch (error: any) {
    return error;
  }
};

export const companyNamesMasterData = async (params) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_COM_NAMES, params);
    return data.data;
  } catch (error: any) {
    return error;
  }
};

export const designationMasterData = async (params) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_DESIGNATION, params);
    return data.data;
  } catch (error: any) {
    return error;
  }
};

export const locationsMasterData = async (params) => {
  try {
    const { data } = await API.post(API_ENDPOINTS.MAC_LOCATIONS, params);
    return data.data;
  } catch (error: any) {
    return error;
  }
};

export const certificateProviderMasterData = async (params) => {
  const { data } = await API.post(API_ENDPOINTS.MAC_CERT_PROVIDER, params);
  return data.data;
}
export const RollCategoryMasterData = async (params: any) => {
  const { data } = await API.post(API_ENDPOINTS.MAC_JOB_ROLE_CATEGORY, params);
  return data.data;
};

export const RollMasterData = async (params: any) => {
  const { data } = await API.post(API_ENDPOINTS.MAC_JOBROLE, params);
  return data.data;
};

export const specializationMasterData = async (body) => {
  const { data } = await API.post(API_ENDPOINTS.MAC_SPECIALIZATION, body);
  return data.data;
};

export const certificateNameMasterData = async (params) => {
  const { data } = await API.post(API_ENDPOINTS.MAC_MASTER_CERTNANME, params);
  return data.data;
}

