import axios from 'axios'

const apiTheses = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    search(query) {
        return apiTheses.get("/recherche-java/?q=" + query);
    }
}