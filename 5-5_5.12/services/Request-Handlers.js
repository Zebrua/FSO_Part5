import axios from 'axios'
const server_base = 'http://localhost:3003'
//const server_base = ''


const getAll = () => {
  const request = axios.get(`${server_base}/api`)
  return request.then(response => response.data)
}

const addNew = (blog, config) => {
  const request = axios.post(`${server_base}/api`, blog, config)
  return request.then(response => response.data)
    .catch(error => error.response.data)
}

const updateBlog = (blog) => {
  const request = axios.put(`${server_base}/api/${blog.id}`, blog)
  return request.then(response => response.data)
    .catch(error => error.response.data)
}

const login = async (credentials) => {
  const response =  axios.post(`${server_base}/login`, credentials)
  return response.then(response => response.data)
    .catch(error => error.response.data)
}
const deleteCall = (blog_id, config) => {
  const request = axios.delete(`${server_base}/api/${blog_id}`, config)
  return request.then(response => response.data)
    .catch(error => error.response.data)
}

export {
  getAll,
  addNew,
  updateBlog,
  login,
  deleteCall
}