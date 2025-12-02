import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

const instance = axios.create({
  baseURL,
  withCredentials: true,
})

instance.defaults.withCredentials = true

export default instance
