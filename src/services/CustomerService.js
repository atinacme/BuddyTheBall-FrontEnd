import HttpRequest from "./HttpRequest";
import Config from "../../Config";

const baseUrl = process.env.REACT_APP_BASE_URL;

const GetCustomersService = async () => {
    return await HttpRequest("GET", `${baseUrl}/getCustomers`, null);
};

const GetCustomerWithSchoolIdService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getCustomerWithSchoolId/${id}`, null);
};

const GetParticularCustomerPhotosService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularCustomerPhotos/${id}`, null);
};

const GetParticularCustomerService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularCustomer/${id}`, null);
};

const UpdateCustomerService = async (userId, customerId, data) => {
    return await HttpRequest("PUT", `${baseUrl}/updateCustomer/${userId}/${customerId}`, data);
};

const GetCustomerParticularPhotoService = async (id) => {
    return await HttpRequest("GET", `${baseUrl}/getParticularPhoto/${id}`, null);
};

const UpdateCustomerPhotosOnMessageService = async (id, data) => {
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

const GetCustomerWithSlot = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/findCustomerWithSlot`, data);
};

const DeleteCustomerService = async (data) => {
    return await HttpRequest("DELETE", `${baseUrl}/deleteCustomer`, data);
};

export {
    GetCustomersService, GetCustomerWithSchoolIdService, GetParticularCustomerPhotosService, GetParticularCustomerService,
    UpdateCustomerService, GetCustomerParticularPhotoService, UpdateCustomerPhotosOnMessageService, CreateAndUpdateMessageService,
    GetMessagesBySenderIdService, GetMessagesBySenderIdReceiverIdService, GetAwardPhotosService, GetCustomerWithSlot, DeleteCustomerService
};