import HttpRequest from "./HttpRequest";
import Config from "../../Config";

const baseUrl = Config.REACT_APP_BASE_URL;
console.log("baseurl--->", baseUrl);

const SignInService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/signin`, data);
};

const SignUpService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/signup`, data);
};

export { SignInService, SignUpService };