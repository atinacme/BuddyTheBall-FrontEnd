import Config from '../../Config';
import HttpRequest from './HttpRequest';

const baseUrl = Config.REACT_APP_BASE_URL;

const CreateScheduleService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createSchedule`, data);
};
const GetSchedulesService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getSchedules`, null);
};

const GetScheduleByDateAndCoachService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getScheduleByDateAndCoach`, data);
};

const GetScheduleByCoachService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getScheduleByCoach`, data);
};

const GetScheduleCreatedByUserIdService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getScheduleCreatedByUserId/${id}`, null);
};

const UpdateScheduleService = async (id, data) => {
    return await HttpRequest("POST", `${baseUrl}/updateSchedule/${id}`, data);
};

const GetScheduleByRegionalManagerAndSchoolService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getScheduleByRegionalManagerAndSchool`, data);
};

export {
    CreateScheduleService, GetSchedulesService, GetScheduleByDateAndCoachService, GetScheduleByCoachService,
    GetScheduleCreatedByUserIdService, UpdateScheduleService, GetScheduleByRegionalManagerAndSchoolService
};