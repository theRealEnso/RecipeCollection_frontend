import axios from "axios";
import * as SecureStore from "expo-secure-store";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;

// goal of interceptor is to catch any 401 (unauthorized) responses causes by an expired jwt token and:
// send a POST request to /refresh-token endpoint to get a new access token from the server
// then, retry the original failed request with the new token
// then, update the stored token 

const api = axios.create({
    baseURL: RECIPE_COLLECTION_ENDPOINT,
});

let isRefreshing = false;
let failedQueue: any[] = []; // queue of requests waiting for a new token

// utility function to replay queued requests
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom => {
        if(error){
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    }))

    failedQueue = [];
};

// intercept responses
api.interceptors.response.use(
    response => response, // if request succeeds, just return the response
    async error => {
        const originalRequest = error.config;

        // Check: Is this a 401 error and the first time we're retrying it?
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            // If a refresh request is already in progress, wait for it to finish
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            // retry this request with the new token
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },

                        reject: (error: any) => reject(error),
                    });
                });
            };

            //Otherwise, mark that we are refreshing now
            isRefreshing = true;

            // ask the server to issue a new access token using refresh token that should be stored in expo
            try {
                const refreshToken = await SecureStore.getItemAsync("refresh-token");

                const { data } = await axios.post(`${RECIPE_COLLECTION_ENDPOINT}/auth/refresh-token`, {refresh_token: refreshToken});

                const newAccessToken = data.access_token;

                // save token to SecureStore or global context
                await SecureStore.setItemAsync("accessToken", newAccessToken);

                //update default headers for all future requests
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                //retry all requests that were waiting
                processQueue(null, newAccessToken);

                //retry the original request that failed with the new access token retrieived from the server
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch(error) {
                // if refresh fails, then reject all the queued requests
                processQueue(error, null);
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        };

        // if its not a 401 or retry failed, then reject
        return Promise.reject(error);
    }
);

export default api;