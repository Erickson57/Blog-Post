class ApiService {
    constructor(baseUrl) {
        this.url = baseUrl
    }

    async createPost(post) {
        try {
            const request = new Request(this.url + '/posts.json', {
                method: 'post',
                body: JSON.stringify(post)
            })


            const response = await fetch(request)
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    async fetchPosts() {
        try {
            const request = new Request(`${this.url}/posts.json`, {
                method: 'get'
            })
            const response = await fetch(request)
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    async fetchPostById(id) {
        try {
            const request = new Request(`${this.url}/posts/${id}.json`, {
                method: 'get'
            })
            const response = await fetch(request)
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }
}

export const apiService = new ApiService('https://wfm-js-1fb84-default-rtdb.firebaseio.com')