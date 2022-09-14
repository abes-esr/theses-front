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
        return apiTheses.post("/", {
            "query": {
                "bool": {
                    "must": {
                        "query_string": {
                            "query": query
                        }
                    }
                }
            }
        });
    }
}