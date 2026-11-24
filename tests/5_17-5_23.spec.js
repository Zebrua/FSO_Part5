// @ts-check
const { test, expect, describe } = require('@playwright/test');
//import describe from '@playwright/test';
//import beforeEach from '@playwright/test';
const pw = require('playwright');
const { loginHelper, addBlog, likeBlog } = require('./test_helper')
describe('Basic app', () => {
  test.beforeEach('Start', async ({ page }) => {
    const getterPromise = page.waitForResponse('http://localhost:3003/api')
    await page.goto('http://localhost:5173')
    const resolve = await getterPromise
  })

  test('Front page can be opened', async ({ page }) => {
    await expect(page.getByText('Existing Blogs')).toBeVisible()
  })

  test('Login fails with wrong password', async ({ page }) => {
    await loginHelper(page, 'root', 'This_is_not_a_password')
    await expect(page.getByText('invalid username or password')).toBeVisible()
  })

  test('User can login with correct credentials', async ({ page }) => {
    await loginHelper(page, 'root', 'sekret')
    await expect(page.getByText('root is logged in')).toBeVisible()

  })

  describe('When logged in', () => {
    test.beforeEach('Start', async ({ page, request }) => {
      test.setTimeout(20000)
      const getterPromise = page.waitForResponse('http://localhost:3003/api')
      await page.goto('http://localhost:5173')
      const resolve = await getterPromise
      await loginHelper(page, 'root', 'sekret')
      await page.getByText('root is logged in').waitFor()
      await request.delete('http://localhost:3003/testing/reset')
      const reloadPromise = page.waitForResponse('http://localhost:3003/api')
      await page.reload()
      const res = await reloadPromise
      await addBlog(page, 'Base blog', 'https://blogsource.con')
    })

    test('A new blogpost can be added', async ({ page }) => {
      const getterPromise = page.waitForResponse('http://localhost:3003/api')
      await page.reload()
      const resolve = await getterPromise
      await addBlog(page, 'New diary entry', 'https://flyingwalris.con')
      await page.getByTitle('New diary entry').getByRole('button', { name: 'view' }).waitFor()
      await page.getByTitle('New diary entry').getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('https://flyingwalris.con')).toBeVisible()
    })

    test('Blogpost can be liked', async ({ page }) => {
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).waitFor()
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).click()
      await expect(page.getByTitle('Likes')).toHaveText('0Like')
      await page.getByRole('button', { name: 'Like' }).click()
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).click()
      await expect(page.getByTitle('Likes')).toHaveText('1Like')
    })

    test('Delete button is not visible if not logged as author', async ({ page }) => {
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).waitFor()
      await page.getByRole('button', { name: 'Log out' }).click()
      await page.getByRole('button', { name: 'Log in' }).waitFor()
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Delete' })).toBeHidden()
    })

    test('Delete button is visible for post author and works', async ({ page }) => {
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).waitFor()
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'Delete' }).click()
      await page.reload()
      await expect(page.getByText('Base blog')).not.toBeVisible()
    })

    test('Blogs are ordered by likes', async ({ page }) => {
      test.setTimeout(75000)

      await likeBlog(page, 'Base blog', 2)
      const getterPromise = page.waitForResponse('http://localhost:3003/api')
      await page.reload()
      const resolve = await getterPromise
      await addBlog(page, 'NewBlog', 'https://sourcepage.con')
      await page.getByText('Added NewBlog').waitFor()
      await likeBlog(page, 'NewBlog', 1)

      const reloadPromise = page.waitForResponse('http://localhost:3003/api')
      await page.reload()
      const reload = await reloadPromise
      await addBlog(page, 'NewBlog2', 'https://sourcepage.con')
      await page.getByText('Added NewBlog2').waitFor()
      await likeBlog(page, 'NewBlog2', 3)

      const Promise = page.waitForResponse('http://localhost:3003/api')
      await page.reload()
      const response = await Promise
      await addBlog(page, 'NewBlog3', 'https://sourcepage.con')
      await page.getByText('Added NewBlog3').waitFor()
      await page.getByTitle('NewBlog3').getByRole('button', { name: 'view' }).click()
      await page.getByTitle('NewBlog2').getByRole('button', { name: 'view' }).click()
      await page.getByTitle('NewBlog').getByRole('button', { name: 'view' }).click()
      await page.getByTitle('Base blog').getByRole('button', { name: 'view' }).click()


      await expect(page.getByTitle('blogs').getByTitle('Likes').nth(0)).toHaveText('3Like')
      await expect(page.getByTitle('blogs').getByTitle('Likes').nth(1)).toHaveText('2Like')
      await expect(page.getByTitle('blogs').getByTitle('Likes').nth(2)).toHaveText('1Like')
      await expect(page.getByTitle('blogs').getByTitle('Likes').nth(3)).toHaveText('0Like')

    })
  })

})
