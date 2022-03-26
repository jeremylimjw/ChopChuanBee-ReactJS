import { axiosObject } from "./axiosWrapper";

export class ChatApiHelper {
    static async getChannels(params) {
        return axiosObject.get(`/chat/channel`, { params: params })
            .then(res => res.data);
    }

    static async createChannel(newChannel) {
        return axiosObject
            .post("/chat/channel", newChannel)
            .then((res) => res.data)
    }

}