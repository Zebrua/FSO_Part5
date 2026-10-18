import { useEffect, useState, useRef } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { expect, test } from 'vitest'



test("Test blog's initial display information.", async () => {

    const visible = false
    const hiddenWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const Blogs = [
        {
            title: "Logs have been updated.",
            author: "Thomas hudson",
            url: "https://blogsource.con",
            likes: 11,

        }, {
            title: "The unbearable lightness of being.",
            author: "Milan Kundera",
            url: "https://archivarius.con",
            likes: 0,

        }, {
            title: "Overpass of technolution.",
            author: "Marshal Matters",
            url: "https://flyingwalrus.con",
            likes: 13,

        }
    ]
    const blog_list = Blogs.sort((b1, b2) => b2.likes - b1.likes)

    render(
        <dl>
            {blog_list.map((blog) => (
                <>
                    <dt key={blog.id}>{blog.title}</dt>
                    <div style={hiddenWhenVisible}>
                        <button onClick={() => { console.log("changed") }}>NotYetButSoon</button>
                    </div>
                    <div style={showWhenVisible}>
                        <>
                            <dd>{blog.url}</dd>
                            <dd>{blog.likes}
                                <button onClick={() => console.log("This is update likes.")}>Like</button>
                            </dd>
                            <dd>{blog.author}</dd>
                            <button onClick={() => console.log("This is delete blog.")}>Delete</button><div />
                        </>
                        <button onClick={console.log("Epic")}>ThisShouldBeDefined</button>
                    </div>
                </>
            ))}
        </dl>
    )

    const TitleOne = screen.getByText("The unbearable lightness of being.")
    expect(TitleOne).toBeInTheDocument()

    const AuthorOne = screen.queryByDisplayValue("Milan Kundera")
    expect(AuthorOne).toBeNull()

    const URLOne = screen.queryByDisplayValue("https://archivarius.con")
    expect(URLOne).toBeNull()

    const LikesOne = screen.queryByDisplayValue(0)
    expect(LikesOne).toBeNull()

    const TitleTwo = screen.queryByDisplayValue("Logs have been updated.")
    expect(TitleTwo).toBeDefined()

    const AuthorTwo = screen.queryByDisplayValue("Thomas Hudson")
    expect(AuthorTwo).toBeNull()

    const URLTwo = screen.queryByDisplayValue("https://blogsource.con")
    expect(URLTwo).toBeNull()

    const LikesTwo = screen.queryByDisplayValue(11)
    expect(LikesTwo).toBeNull()

    const TitleThree = screen.getByText("Overpass of technolution.")
    expect(TitleThree).toBeDefined()

    const AuthorThree = screen.queryByDisplayValue("Marshal Matters")
    expect(AuthorThree).toBeNull()

    const URLThree = screen.queryByDisplayValue("https://flyingwalrus.con")
    expect(URLThree).toBeNull()

    const LikesThree = screen.queryByDisplayValue(13)
    expect(LikesThree).toBeNull()
})

test("Test display in expanded state.", async () => {
    const visible = true
    const hiddenWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const Blogs = [
        {
            title: "Logs have been updated.",
            author: "Thomas Hudson",
            url: "https://blogsource.con",
            likes: 11,

        }, {
            title: "The unbearable lightness of being.",
            author: "Milan Kundera",
            url: "https://archivarius.con",
            likes: 0,

        }, {
            title: "Overpass of technolution.",
            author: "Marshal Matters",
            url: "https://flyingwalrus.con",
            likes: 13,

        }
    ]
    const blog_list = Blogs.sort((b1, b2) => b2.likes - b1.likes)

    render(
        <dl>
            {blog_list.map((blog) => (
                <>
                    <dt key={blog.id}>{blog.title}</dt>
                    <div>
                        <div style={hiddenWhenVisible}>
                            <button onClick={() => { console.log("changed") }}>NotYetButSoon</button>
                        </div>
                        <div style={showWhenVisible}>
                            <>
                                <dd>{blog.url}</dd>
                                <dd>{blog.likes}
                                    <button onClick={() => console.log("This is update Likes.")}>Like</button>
                                </dd>
                                <dd>{blog.author}</dd>
                                <button onClick={() => console.log("This is delete blog.")}>Delete</button><div />
                            </>
                            <button onClick={console.log("Epic")}>ThisShouldBeDefined</button>
                        </div>
                    </div>
                </>
            ))}
        </dl>
    )

    const TitleOne = screen.getByText("The unbearable lightness of being.")
    expect(TitleOne).toBeInTheDocument()

    const AuthorOne = screen.getByText("Milan Kundera")
    expect(AuthorOne).toBeInTheDocument()

    const URLOne = screen.getByText("https://archivarius.con")
    expect(URLOne).toBeInTheDocument()

    const LikesOne = screen.getByText(0)
    expect(LikesOne).toBeInTheDocument()

    const TitleTwo = screen.getByText("Logs have been updated.")
    expect(TitleTwo).toBeInTheDocument()

    const AuthorTwo = screen.getByText("Thomas Hudson")
    expect(AuthorTwo).toBeInTheDocument()

    const URLTwo = screen.getByText("https://blogsource.con")
    expect(URLTwo).toBeInTheDocument()

    const LikesTwo = screen.getByText(11)
    expect(LikesTwo).toBeInTheDocument()

    const TitleThree = screen.getByText("Overpass of technolution.")
    expect(TitleThree).toBeDefined()

    const AuthorThree = screen.getByText("Marshal Matters")
    expect(AuthorThree).toBeInTheDocument()

    const URLThree = screen.getByText("https://flyingwalrus.con")
    expect(URLThree).toBeInTheDocument()

    const LikesThree = screen.getByText(13)
    expect(LikesThree).toBeInTheDocument()

})

test("Use of Like Button works as expected", async () => {
    const visible = true
    const hiddenWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const user = userEvent.setup()
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()

    const Blogs = [
        {
            title: "Logs have been updated.",
            author: "Thomas Hudson",
            url: "https://blogsource.con",
            likes: 11,

        }, {
            title: "The unbearable lightness of being.",
            author: "Milan Kundera",
            url: "https://archivarius.con",
            likes: 0,

        }, {
            title: "Overpass of technolution.",
            author: "Marshal Matters",
            url: "https://flyingwalrus.con",
            likes: 13,

        }
    ]
    const blog_list = Blogs.sort((b1, b2) => b2.likes - b1.likes)

    render(
        <dl>
            {blog_list.map((blog) => (
                <>
                    <dt key={blog.id}>{blog.title}</dt>
                    <div>
                        <div style={hiddenWhenVisible}>
                            <button onClick={() => { console.log("changed") }}>NotYetButSoon</button>
                        </div>
                        <div style={showWhenVisible}>
                            <>
                                <dd>{blog.url}</dd>
                                <dd>{blog.likes}
                                    <button onClick={() => updateLikes()}>Like</button>
                                </dd>
                                <dd>{blog.author}</dd>
                                <button onClick={() => deleteBlog()}>Delete</button><div />
                            </>
                            <button onClick={console.log("Epic")}>ThisShouldBeDefined</button>
                        </div>
                    </div>
                </>
            ))}
        </dl>
    )
    const likeButton = screen.getAllByText('Like')
    await user.click(likeButton[1])
    await user.click(likeButton[1])

    expect(updateLikes.mock.calls).toHaveLength(2)
})

test("Submitting the new blog calls the correct function.", async () => {
    const visible = true
    const hiddenWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const addblog = vi.fn()

    const Blogs = [
        {
            title: "Logs have been updated.",
            author: "Thomas Hudson",
            url: "https://blogsource.con",
            likes: 11,

        }, {
            title: "The unbearable lightness of being.",
            author: "Milan Kundera",
            url: "https://archivarius.con",
            likes: 0,

        }, {
            title: "Overpass of technolution.",
            author: "Marshal Matters",
            url: "https://flyingwalrus.con",
            likes: 13,

        }
    ]

    render(<div>
        <form onSubmit={event => addblog()}>
            <div>
                <label>
                    title:
                    <input
                        type='text'
                        onChange={event => console.log("fly")}
                    />
                </label>
            </div>
            <div>
                <label>
                    url:
                    <input
                        type='text'
                        onChange={event => console.log("NEw!!")}
                    />
                </label>
            </div>
            <button type="submit">add</button>
        </form>
    </div>)

    const user = userEvent.setup()
    const input = screen.getAllByRole('textbox')
    const addButton = screen.getByText('add')

    await user.type(input[0], 'Blogpost about hardships of testing')
    await user.type(input[1], 'https://flyingwalrus.con')
    await user.click(addButton)

    expect(addblog.mock.calls).toHaveLength(1)
})
