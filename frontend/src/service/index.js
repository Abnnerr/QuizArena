import axios from 'axios'

const AXIOS = axios.create({
    baseURL: "http://localhost:9000",
    withCredentials: true
})


export default AXIOS