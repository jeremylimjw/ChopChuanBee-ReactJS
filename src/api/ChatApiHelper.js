import { axiosObject } from "./axiosWrapper";

export class ChatApiHelper {
    static async getChannels(params) {
        return axiosObject.get(`/chat/channel`, { params: params })
            .then(res => res.data);
    }

    static async createChannel(newChannel) {
        return axiosObject.post("/chat/channel", newChannel)
            .then((res) => res.data)
    }

    static async getChannelById(params) {
        return axiosObject.get(`/chat/channel/id`, { params: params })
            .then(res => res.data);
    }

    static async deleteChannel(channelId) {
        return axiosObject.delete("/chat/channel", { params: { channel_id: channelId }})
            .then((res) => res.data)
    }

    static async addChannelParticipant(participant) {
        return axiosObject.post("/chat/channel/participant", participant)
            .then((res) => res.data)
    }

    static async deleteChannelParticipant(params) {
        return axiosObject.delete("/chat/channel/participant", { params: params })
            .then((res) => res.data)
    }

    static async getTexts(params) {
        return axiosObject.get(`/chat/text`, { params: params })
            .then(res => res.data);
    }

    static async createText(newText) {
        return axiosObject.post("/chat/text", newText)
            .then((res) => res.data)
    }

    static async getLastSeens(params) {
        return axiosObject.get(`/chat/lastSeen`, { params: params })
            .then(res => res.data);
    }

}