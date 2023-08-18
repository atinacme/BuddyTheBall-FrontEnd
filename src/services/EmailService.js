import Config from '../../Config';
import HttpRequest from './HttpRequest';

const baseUrl = Config.REACT_APP_BASE_URL;

const EmailingService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/billingEmail`, data);
};

export { EmailingService };