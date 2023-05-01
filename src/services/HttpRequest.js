import axios from "axios";

const HttpRequest = async (method, url, data) => {
    const response = await axios({
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-Requested-With": "XMLHttpRequest",
        },
        url: url,
        data: JSON.stringify(data),
    });
    return response.data;
};

export default HttpRequest;
