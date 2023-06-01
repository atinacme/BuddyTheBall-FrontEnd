import Config from '../../Config';
import HttpRequest from './HttpRequest';

const baseUrl = Config.REACT_APP_BASE_URL;

const EmailingService = async () => {
    return await HttpRequest("GET", `${baseUrl}/billingEmail`, null);
};

export { EmailingService };