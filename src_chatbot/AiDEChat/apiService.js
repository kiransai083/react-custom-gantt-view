import api from "../api";

export const getAgentResponse = async (data) => {
    const res = await api.post('/bot/response', data);
    return res;
};

export const performSpeechToText = async (data) => {
    const res = await api.post('/transcribe', data);
    return res;
};

// export const doAgentTransfer = async (data) => {
//     const res = await api.post('/api/v1/bolt-chat/agent-transfer', data);
//     return res;
// };