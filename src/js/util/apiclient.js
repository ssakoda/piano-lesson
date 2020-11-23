
import axios from 'axios';

const API_URL = (process.env.API_URL) ? process.env.API_URL : "";

console.log(`------------- API_URL -----[${API_URL}]-------`);

const get = (path, config) => {
    return axios.get(API_URL + path, config);
};

const post = (path, data, config) => {
    return axios.post(API_URL + path, data, config);
};

export default {get, post}