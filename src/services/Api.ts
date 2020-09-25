import axios from 'axios'
import config from '../config'

export const chessApi = axios.create({
    baseURL: config.serviceUrl
})