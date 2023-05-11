import Config from "../../Config";
import HttpRequest from "./HttpRequest";

const baseUrl = process.env.REACT_APP_BASE_URL;

const CreateAndUpdateAttendanceService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createAndUpdateAttendance`, data);
};

const GetAttendanceByDateService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getAttendanceByDate`, data);
};

const GetAttendanceBySessionService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/getAttendanceBySession`, data);
};

export {
    CreateAndUpdateAttendanceService, GetAttendanceByDateService, GetAttendanceBySessionService
};