import { axiosObject } from "./axiosWrapper";

export const httpLogin = async function(username, password) {
    return axiosObject.post(`/auth`, { username: username, password: password});
}

export const httpLogout = async function() {
    return axiosObject.get(`/auth/logout`);
}