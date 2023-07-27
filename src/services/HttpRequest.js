import axios from "axios";

const HttpRequest = async (method, url, data) => {
        
        if(data==null){
            const response = await axios({
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                url: url
            });
            return response.data;
        } else{
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
        }
    
       
    
   
};

export default HttpRequest;
