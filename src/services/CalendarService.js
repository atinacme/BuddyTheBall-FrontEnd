import Config from '../../Config';
import HttpRequest from './HttpRequest';

const baseUrl = process.env.REACT_APP_BASE_URL;

const CreateAgendaService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createAgenda`, data);
};

const GetAgendaByDateAndCoachService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getAgendaByDateAndCoach`, data);
};

const GetAgendaByCoachService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getAgendaByCoach/${id}`, null);
};

const UpdateAgendaService = async (id, data) => {
    return await HttpRequest("POST", `${baseUrl}/updateAgenda/${id}`, data);
};

export { CreateAgendaService, GetAgendaByDateAndCoachService, GetAgendaByCoachService, UpdateAgendaService };