import Config from "../../Config";
import HttpRequest from "./HttpRequest";

const baseUrl = Config.REACT_APP_BASE_URL;

const CoachPhotoUploadService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/uploadPhotos`, data);
};

const GetAllCoachesService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getCoaches`, null);
};

const GetParticularCoachService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularCoach/${id}`, null);
};

const GetCustomersOfParticularCoachService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getCustomersOfParticularCoach`, data);
};

const GetCustomersOfParticularCoachOfParticularSchool = async (coachId, schoolId) => {
    return await HttpRequest("GET", `${baseUrl}/getCustomersOfParticularCoachOfParticularSchool/${coachId}/${schoolId}`, null);
};

const CoachUpdateService = async (userId, coachId, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateCoach/${userId}/${coachId}`, data);
};

const DeleteCoachService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteCoach`, data);
};

const GetAnyParticularImageService = async (filename) => {
    return await HttpRequest("GET", `${baseUrl}/getAnyParticularImage/${filename}`, null);
};

export {
    CoachPhotoUploadService, GetAllCoachesService, GetParticularCoachService, GetCustomersOfParticularCoachService,
    GetCustomersOfParticularCoachOfParticularSchool, CoachUpdateService, DeleteCoachService, GetAnyParticularImageService
};