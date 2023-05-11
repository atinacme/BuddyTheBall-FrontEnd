import Config from "../../Config";
import HttpRequest from "./HttpRequest";

const baseUrl = process.env.REACT_APP_BASE_URL;

const GetAllRegionalManagersService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getRegionalManagers`, null);
};

const GetParticularRegionalManagerService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/findParticularRegionalManager/${id}`, null);
};

const GetCoachesOfParticularRegionalManager = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getCoachesOfParticularRegionalManager/${id}`, null);
};

const GetCoachOfParticularRegionalManager = async (coachId, regionalManagerId) => {
    return await HttpRequest("GET", `${baseUrl}/getCoachOfParticularRegionalManager/${coachId}/${regionalManagerId}`, null);
};

const RegionalManagerUpdateService = async (userId, regionalManagerId, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateRegionalManager/${userId}/${regionalManagerId}`, data);
};

const DeleteRegionalManagerService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteRegionalManager`, data);
};

export {
    GetAllRegionalManagersService, GetParticularRegionalManagerService, GetCoachesOfParticularRegionalManager,
    GetCoachOfParticularRegionalManager, RegionalManagerUpdateService, DeleteRegionalManagerService
};