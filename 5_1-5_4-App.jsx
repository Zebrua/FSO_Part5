import { useEffect, useState } from 'react'
import axios from "axios"
const server_base = "http://localhost:3003/api"
//const server_base = "/api"

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const Notification = ({ Message }) => {
  if (Message === null) {
    return null
  }
  return ( 
    <div className='confirmation'>
      {Message}
    </div>
  )
}

const Error = ({ Mess }) => {
  if (Mess === null) {
    return null
  }
  return(
    <div className='error'> 
      {Mess}
    </div>
  )
}

const getAll = () => {
  const request = axios.get(`${server_base}`)
  return request.then(response => response.data)
}

const getBlog = (id) => {
  const request = axios.get(`${server_base}/${id}`)
  return request.then(response => response.data)
}

const addNew = (blog, config) => {
  const request = axios.post(`${server_base}`, blog, config)
  return request.then(response => response.data)
  .catch(error => error.response.data)
}

const updateBlog = (blog) => {
  const request = axios.put(`${server_base}/${blog.id}`, blog)
  return request.then(response => response.data)
  .catch(error => error.response.data)
}

const login = async (credentials) => {
  const response =  axios.post(`http://localhost:3003/login`, credentials)
  return response.then(response => response.data)
  .catch(error => error.response.data)
}

const UserHandler = (props) => {
  const usernameTracking = (event) =>{
    // console.log(event.target.value)
    props.setUsername(event.target.value)
  }
  const passwordTracking = (event) =>{
    // console.log(event.target.value)
    props.setPassword(event.target.value)
  }

  const handleLogin = async event => {
    event.preventDefault()
      const InProgress = {
        username: props.Username,
        password: props.Password
      }

      const response = await login(InProgress)
      if (response.error) {
      props.setMess(`${response.error}`)
      setTimeout(() => {
        props.setMess(null)
      }, 6000)
      }else {
      props.setMessage(`Logged in as ${props.Username}`)
      window.localStorage.setItem(
        'loggedUserData', JSON.stringify(response)
      ) 
      setToken(response.token)
      props.setUser(response)
      setTimeout(() => {
        props.setMessage(null)
      }, 6000)
      props.setUsername('')
      props.setPassword('')
      }
    }

  return(
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={props.Username}
            onChange={usernameTracking}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={props.Password}
            onChange={passwordTracking}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
} 

const NewBlog = (props) => {

  const addBlog = async (event) => {
    event.preventDefault()
    const blog_li = [...props.Blogs]
    if (blog_li.find((title) => {title === props.Title})){
      const change = confirm(`${props.Title} is already added to collection, do you want to update the details?`)
      if (change){
        const Artifact = blog_li.find((title) => {title === props.Title})
        Artifact.url = props.Adress
        const response = await updateBlog(Artifact)
        if (response.error) {
          props.setMess(`${response.error}`)
          await setTimeout(() => {
            props.setMess(null)
          }, 6000)
        }else{
          props.setMessage(`Updated ${props.Title}`)
          await setTimeout(() => {
            props.setMessage(null)
          }, 6000)
          props.setTitle("")
          props.setAdress("")
        }
      }
    }else{
        const loggedUser = props.User.user
        const Artifact = {
          title: props.Title,
          author: loggedUser.name,
          url: props.Adress,
          likes: props.Likes
        }
        const config = {
          headers: { Authorization: token }
        }
        const response = await addNew(Artifact, config)
        if (response.error){
          props.setMess(`${response.error}`)
          await setTimeout(() =>{
            props.setMess(null)
          }, 6000)
        }else{
          props.setMessage(`Added ${props.Title}`)
          await setTimeout(() => {
            props.setMessage(null)
          }, 6000)
          blog_li.push(Artifact)
          props.setBlogs(blog_li)
          props.setTitle('')
          props.setAdress('')
        }
      }
  }

  const titleTracking = (event) =>{
    // console.log(event.target.value)
    props.setTitle(event.target.value)
  }
  const adressTracking = (event) =>{
    // console.log(event.target.value)
    props.setAdress(event.target.value)
  }

  return(
    <form onSubmit={addBlog}>
      <div>
        title: <input 
        value={props.Title}
        onChange={titleTracking}/>
      </div>
      <div>
        url: <input
        value={props.Adress}
        onChange={adressTracking}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Display = (props) => {
  const updateLikes = async (blog) => {
    blog.likes += 1
    const response = await updateBlog(blog)
    if (response.error) {
          props.setMess(`${response.error}`)
          await setTimeout(() => {
            props.setMess(null)
          }, 6000)
        }else{
          props.setMessage(`Liked ${blog.title}`)
          await setTimeout(() => {
            props.setMessage(null)
          }, 6000)
    }
  }
  const list = props.Blogs
  return (
    <div>
      {list.map((blog) =>  (
        <>
        <p key={blog.id}>{blog.title}<br/>
        {blog.author}<br/>
        {blog.url}<br/>
        {blog.likes}</p>
        <button onClick={() => updateLikes(blog)}>Like</button>
        </>
      ))}
    </div>
  )
}


const App = () => {

  const [Blogs, setBlogs] = useState([])
  const [Title, setTitle] = useState('')
  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')
  const [Adress, setAdress] = useState('')
  const [Likes, setLikes] = useState(0)
  const [Message, setMessage] = useState(null)
  const [Mess, setMess] = useState(null)
  const [User, setUser] = useState(null)

  useEffect(() =>{
    getAll()
    .then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUserData')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      setToken(user.token)
    }
  }, [])  

  return (
    <div>
      <h1>Blogs</h1>
      <Error Mess={Mess}/>
      <Notification Message={Message}/>
      
      {!User && (
        <div>
          <UserHandler User={User} setUser={setUser} Username={Username} setUsername={setUsername} Password={Password} setPassword={setPassword} 
          setMessage={setMessage} setMess={setMess} />
        </div>
      )}
      {User && (
        <div>
          <p>{User.user.username} is logged in</p><button onClick={() => window.localStorage.removeItem("loggedUserData")}>Log out</button>
          <NewBlog User={User} Blogs={Blogs} setBlogs={setBlogs} Title={Title} setTitle={setTitle}  Adress={Adress} setAdress={setAdress} 
          setMessage={setMessage} setMess={setMess} Likes={Likes} />
        </div>
      )}

      <h2>Existing Blogs</h2>
      <div>
        <Display Blogs={Blogs} setBlogs={setBlogs} Likes={Likes} setLikes={setLikes} setMessage={setMessage} setMess={setMess} />
      </div>
    </div>
  )
}

export default App
