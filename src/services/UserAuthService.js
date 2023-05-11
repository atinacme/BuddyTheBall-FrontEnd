import HttpRequest from "./HttpRequest";
import Config from "../../Config";

const baseUrl = process.env.REACT_APP_BASE_URL;
console.log("baseurl--->", process.env.REACT_APP_BASE_URL, baseUrl);

const SignInService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/signin`, data);
};

const SignUpService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/auth/signup`, data);
};

export { SignInService, SignUpService };