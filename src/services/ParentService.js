import HttpRequest from "./HttpRequest";
import Config from "../../Config";

const baseUrl = Config.REACT_APP_BASE_URL;

const GetParentsService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getCustomers`, null);
};

const GetParentWithSchoolIdService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getCustomerWithSchoolId/${id}`, null);
};

const GetParticularParentPhotosService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularCustomerPhotos/${id}`, null);
};

const GetParticularParentService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularCustomer/${id}`, null);
};

const UpdateParentService = async (userId, customerId, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateCustomer/${userId}/${customerId}`, data);
};

const GetParentParticularPhotoService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularPhoto/${id}`, null);
};

const UpdateParentPhotosOnMessageService = async (id, data) => {
    return await HttpRequest("POST", `${baseUrl}/updateCustomerPhotosOnMessage/${id}`, data);
};

const CreateAndUpdateMessageService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/createAndUpdateMessage`, data);
};

const GetMessagesBySenderIdService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getMessagesBySenderId/${id}`, null);
};

const GetMessagesBySenderIdReceiverIdService = async (sender_id, receiver_id) => {
    return await HttpRequest("GET", `${baseUrl}/getMessagesBySenderIdReceiverId/${sender_id}/${receiver_id}`, null);
};

const GetAwardPhotosService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getAwardPhotos`, null);
};

const GetParentWithSlot = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/findCustomerWithSlot`, data);
};

const DeleteParentService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteCustomer`, data);
};

export {
    GetParentsService, GetParentWithSchoolIdService, GetParticularParentPhotosService, GetParticularParentService,
    UpdateParentService, GetParentParticularPhotoService, UpdateParentPhotosOnMessageService, CreateAndUpdateMessageService,
    GetMessagesBySenderIdService, GetMessagesBySenderIdReceiverIdService, GetAwardPhotosService, GetParentWithSlot, DeleteParentService
};