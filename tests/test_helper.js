const loginHelper = async (page, username, password) => {
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    const logPromise = page.waitForRequest('http://localhost:3003/login')
    await page.getByRole('button', { name: 'login' }).click()
    const log = await logPromise

}

const addBlog = async (page, title, url) => {
    await page.getByRole('button', { name: 'New Blog' }).click()
    await page.getByRole('textbox').first().fill(title)
    await page.getByRole('textbox').last().fill(url)
    const addPromise = page.waitForRequest('http://localhost:3003/api')
    await page.getByRole('button', { name: 'add' }).click()
    const add = await addPromise
}

const likeBlog = async (page, title, times) => {
    let k = 0;
    while (k < times) {
        await page.getByTitle(title).getByRole('button', { name: 'view' }).click()
        await page.getByTitle(title).getByRole('button', { name: 'Like' }).click()
        await page.getByTitle(title).getByRole('button', { name: 'view' }).waitFor()
        k++
    }
}
export { loginHelper, addBlog, likeBlog }
