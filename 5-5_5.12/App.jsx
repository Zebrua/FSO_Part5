import { useEffect, useState, useRef } from 'react'
import { LoginForm, NewBlogForm, BlogInfo } from './components/Forms'
import { getAll } from './services/Request-Handlers'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}



const UserHandler = (props) => {

  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')

  return(
    <div>
      <Togglable buttonShow="Log in" buttonHide="Cancel">
        {LoginForm (
          Username,
          setUsername,
          setPassword,
          Password,
          props.setMess,
          props.setMessage,
          setToken,
          props.setUser)}
      </Togglable>
    </div>
  )
}

const NewBlog = (props) => {
  const [Title, setTitle] = useState('')
  const [Adress, setAdress] = useState('')
  const blogVisibility = useRef()

  return(
    <div>
      <Togglable buttonShow="New Blog" buttonHide="Cancel" ref={blogVisibility}>
        {NewBlogForm (
          Title,
          setTitle,
          Adress,
          setAdress,
          props.Blogs,
          props.setBlogs,
          props.User,
          token,
          blogVisibility,
          props.setMess,
          props.setMessage
        )}
      </Togglable>
    </div>

  )
}

const Display = (props) => {
  const toggleBlog = useRef()
  
  let blog_list = props.Blogs.sort((b1,b2) => b2.likes-b1.likes)
  return (
    <dl>
      <div>
        {blog_list.map((blog) => (
          <>
            <dt key={blog.id}>{blog.title}</dt>
            <Togglable buttonShow="view" buttonHide="hide" ref={toggleBlog}>
              {BlogInfo(
                blog,
                props.Blogs,
                props.setBlogs,
                toggleBlog,
                props.setMess,
                props.setMessage,
                token
              )}
            </Togglable>
          </>
        ))}
      </div>
    </dl>
  )
}


const App = () => {

  const [Blogs, setBlogs] = useState([])
  const [Message, setMessage] = useState(null)
  const [Mess, setMess] = useState(null)
  const [User, setUser] = useState(false)

  useEffect(() => {
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
      setTimeout(() => {
        window.localStorage.removeItem('loggedUserData')
      }, 3600000)
    }
  }, [])

  return (
    <div>
      <h1>Blogs</h1>
      <Error Mess={Mess}/>
      <Notification Message={Message}/>
      {!User && (
        <div>
          <UserHandler setMessage={setMessage} setMess={setMess} setUser={setUser}/>
        </div>
      )}
      {User && (
        <div>
          <p>{User.user.username} is logged in</p><button onClick={() => {window.localStorage.removeItem('loggedUserData'); setUser(false)}}>Log out</button>
          <NewBlog User={User} Blogs={Blogs} setBlogs={setBlogs} setMessage={setMessage} setMess={setMess}/>
        </div>
      )}

      <h2>Existing Blogs</h2>
      <div>
        <Display Blogs={Blogs} setBlogs={setBlogs} setMessage={setMessage} setMess={setMess} User={User}/>
      </div>
    </div>
  )
}

export default App