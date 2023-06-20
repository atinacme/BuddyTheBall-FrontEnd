import HttpRequest from "./HttpRequest";
import Config from "../../Config";

const baseUrl = Config.REACT_APP_BASE_URL;
console.log("baseurl--->", Config.REACT_APP_BASE_URL, baseUrl);

const SignInService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/signin`, data);
};

const SignUpService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/signup`, data);
};

const ForgotPasswordService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/forgotPassword`, data);
};

const ResetPasswordService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/resetPassword`, data);
};

export { SignInService, SignUpService, ForgotPasswordService, ResetPasswordService };