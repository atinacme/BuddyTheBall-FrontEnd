import Config from "../../Config";
import HttpRequest from "./HttpRequest";

const baseUrl = Config.REACT_APP_BASE_URL;

const CreateRegionService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createRegion`, data);
};

const GetAllRegionsService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getRegions`, null);
};

const GetParticularRegionService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/findParticularRegion/${id}`, null);
};

const RegionUpdateService = async (id, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateRegion/${id}`, data);
};

const DeleteRegionService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteRegion`, data);
};

export {
    CreateRegionService, GetAllRegionsService, GetParticularRegionService, RegionUpdateService, DeleteRegionService
};