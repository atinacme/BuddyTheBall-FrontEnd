import Config from '../../Config';
import HttpRequest from './HttpRequest';

const baseUrl = Config.REACT_APP_BASE_URL;

const CreateSessionService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createSchedule`, data);
};
const GetSessionsService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getSchedules`, null);
};

const GetSessionByDateAndCoachService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getScheduleByDateAndCoach`, data);
};

const GetSessionByCoachService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getScheduleByCoach`, data);
};

const GetSessionCreatedByUserIdService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getScheduleCreatedByUserId/${id}`, null);
};

const UpdateSessionService = async (id, data) => {
    return await HttpRequest("POST", `${baseUrl}/updateSchedule/${id}`, data);
};

const GetSessionByRegionalManagerAndSchoolService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getScheduleByRegionalManagerAndSchool`, data);
};

const DeleteSessionService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteSchedule`, data);
};

export {
    CreateSessionService, GetSessionsService, GetSessionByDateAndCoachService, GetSessionByCoachService,
    GetSessionCreatedByUserIdService, UpdateSessionService, GetSessionByRegionalManagerAndSchoolService, DeleteSessionService
};