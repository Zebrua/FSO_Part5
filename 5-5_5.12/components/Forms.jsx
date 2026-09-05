import { addBlog, handleLogin, updateLikes, deleteBlog } from '../services/Response-Handlers'

const LoginForm = (Username, setUsername, setPassword, Password, setMess, setMessage, setToken, setUser) => {
  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={event => handleLogin(Username, setUsername, Password, setPassword, setMess, setMessage, setToken, setUser)}>
        <div>
          <label>
            Username
            <input
              type='text'
              value={Username}
              onChange={event => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type='password'
              value={Password}
              onChange={event => setPassword(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const NewBlogForm = (Title, setTitle, Adress, setAdress, Blogs, setBlogs, User, token, blogVisibility, setMess, setMessage) => {
  return(
    <div>
      <form onSubmit={event => addBlog(event, Title, setTitle, Adress, setAdress, Blogs, setBlogs, User, token, blogVisibility, setMess, setMessage)}>
        <div>
          <label>
            title:
            <input
              type='text'
              value={Title}
              onChange={event => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type='text'
              value={Adress}
              onChange={event => setAdress(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const BlogInfo = (blog, Blogs, setBlogs, toggleBlog, setMess, setMessage, token) => {
  return (
    <>
      <dd>{blog.url}</dd>
      <dd>{blog.likes}
        <button onClick={() => updateLikes(blog, Blogs, setBlogs, toggleBlog, setMess, setMessage)}>Like</button>
      </dd>
      <dd>{blog.author}</dd>
      <button onClick={() => deleteBlog(blog, Blogs, setBlogs, toggleBlog, setMess, setMessage, token)}>Delete</button><div/>
    </>
  )
}

export {
  LoginForm,
  NewBlogForm,
  BlogInfo
}