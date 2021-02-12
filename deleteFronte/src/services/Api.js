import axios from 'axios'

axios.interceptors.response.use(function (response) {
		// Do something with response data
		return response;
}, function (error) {
		// Do something with response error
		console.log( 'ERR>>>>>>>>>>>>>>: ', error )
		return Promise.reject(error);
});
export default() => {
		return axios.create({
				baseURL: `http://10.0.0.199:8082`
		})
}
