import Config from "../../Config";
import HttpRequest from "./HttpRequest";

const baseUrl = process.env.REACT_APP_BASE_URL;

const CreateClassService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createClass`, data);
};

const GetClassCreatedByUserIdService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getClassCreatedByUserId`, data);
};

const GetCoachClassesService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getCoachClasses`, data);
};

const GetClassesService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getClasses`, null);
};

const UpdateClassService = async (id, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateClass/${id}`, data);
};

const DeleteClassService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteClass`, data);
};

export {
    CreateClassService, GetClassCreatedByUserIdService, GetCoachClassesService, GetClassesService, UpdateClassService,
    DeleteClassService
};