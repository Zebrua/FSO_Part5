import { addNew, updateBlog, login, deleteCall } from './Request-Handlers'

const addBlog = async (event, Title, setTitle, Adress, setAdress, Blogs, setBlogs, User, token, blogVisibility, setMess, setMessage) => {
  event.preventDefault()
  const blog_li = [...Blogs]
  const loggedUser = User.user
  const Artifact = {
    title: Title,
    author: loggedUser.name,
    url: Adress,
    likes: 0
  }
  const config = {
    headers: { Authorization: token }
  }
  blogVisibility.current.toggleVisibility()
  const response = await addNew(Artifact, config)
  if (response.error){
    setMess(`${response.error}`)
    await setTimeout(() => {
      setMess(null)
    }, 6000)
  }else{
    setMessage(`Added ${Title}`)
    await setTimeout(() => {
      setMessage(null)
    }, 6000)
    blog_li.push(response)
    setBlogs(blog_li)
    setTitle('')
    setAdress('')
  }
}

const handleLogin = async (Username, setUsername, Password, setPassword, setMess, setMessage, setToken, setUser) => {
  event.preventDefault()
  const InProgress = {
    username: Username,
    password: Password
  }
  console.log(InProgress)
  const response = await login(InProgress)
  if (response.error) {
    setMess(`${response.error}`)
    await setTimeout(() => {
      setMess(null)
    }, 6000)
  }else {
    setMessage(`Logged in as ${Username}`)
    window.localStorage.setItem(
      'loggedUserData', JSON.stringify(response)
    )
    setToken(response.token)
    setUser(response)
    await setTimeout(() => {
      setMessage(null)
    }, 6000)
    setUsername('')
    setPassword('')
  }
}

const deleteBlog = async (blog, Blogs, setBlogs, toggleBlog, setMess, setMessage, token) => {
  const blog_list = [...Blogs]
  const del = confirm(`Do you want to delete ${blog.title}?`)
  if (del) {
    const config = {
      headers: { Authorization: token }
    }
    const response = await deleteCall(blog.id, config)
    await toggleBlog.current.toggleVisibility()
    if (response.error) {
      setMess(`${response.error}`)
      await setTimeout(() => {
        setMess(null)
      }, 6000)
    }else{
      const newList = blog_list.filter((out) => out.id !== blog.id)
      setBlogs(newList)
      setMessage(`Deleted ${blog.title}`)
      await setTimeout(() => {
        setMessage(null)
      }, 6000)
    }
  }
}

const updateLikes = async (blog, Blogs, setBlogs, toggleBlog, setMess, setMessage) => {
  const list_of_blogs = [...Blogs]
  blog.likes += 1
  const response = await updateBlog(blog)
  await toggleBlog.current.toggleVisibility()
  if (response.error) {
    setMess(`${response.error}`)
    await setTimeout(() => {
      setMess(null)
    }, 6000)
  }else{
    const blogstate = list_of_blogs.filter((out) => out.id !== blog.id)
    blogstate.push(blog)
    setBlogs(blogstate)
    setMessage(`Liked ${blog.title}`)
    await setTimeout(() => {
      setMessage(null)
    }, 6000)
  }
}

export {
  addBlog,
  handleLogin,
  updateLikes,
  deleteBlog
}