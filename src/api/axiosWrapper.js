import axios from "axios"

/**
* Wrapper of axios that includes credentials 
* How to use:
* GET: axiosObject.get(url, params)
* POST: axiosObject.post(url, params)
* DELETE: axiosObject.delete(url)
* 
* ----- Axios response schema -----
* `data` is the response that was provided by the server
*  data: {},
* 
* `status` is the HTTP status code from the server response
* status: 200,
* 
* `headers` the HTTP headers that the server responded with
* All header names are lower cased and can be accessed using the bracket notation.
* Example: `response.headers['content-type']`
* headers: {}
*
* Sample: 
* axiosObject.get('/user', {params: {ID:123}})
* .then((res) => // Do something with res // ) 
* .catch((err) => // Handle the error // )
*
*/

const BASE_URL = 'http://localhost:3000/api'

export const axiosObject = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})




