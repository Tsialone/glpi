import axios from "axios";
import { baseUrl, nestBaseUrl, UTIL_CONST } from "./const.util";

export const nestApiClient = axios.create({
    baseURL: nestBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UTIL_CONST.token);
        if (token) {
            config.headers["App-Token"] = 'CN8On4dDB1WTwZVGc7n4M9KVp6FocA1gz8PfrghH';
            config.headers["Session-Token"] = token;
            // console.log ("xxx: ",config);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                console.warn("Session GLPI expirée ! Déconnexion automatique...");
                localStorage.removeItem(UTIL_CONST.token);
                // window.location.href = "/";
                return new Promise(() => { });
            }
        }
        return Promise.reject(error);
    }
);



