import HttpRequest from "./HttpRequest";
import Config from "../../Config";

const baseUrl = process.env.REACT_APP_BASE_URL;

const GetSchoolsService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getSchools`, null);
};

const SchoolCreationService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createSchool`, data);
};

const GetParticularSchoolService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularSchool/${id}`, null);
};

const GetRegionWiseSchools = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/findRegionWiseSchools`, data);
};

const GetParticularSchoolPhotosService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularSchoolPhotos/${id}`, null);
};

const SchoolUpdationService = async (id, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateSchool/${id}`, data);
};

const DeleteSchoolService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteSchool`, data);
};

export {
    GetSchoolsService, SchoolCreationService, GetParticularSchoolService, GetRegionWiseSchools,
    GetParticularSchoolPhotosService, SchoolUpdationService, DeleteSchoolService
};