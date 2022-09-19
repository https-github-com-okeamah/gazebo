import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import AdminAccessTable from './AdminAccessTable'

const mockFirstResponse = {
  count: 1,
  next: 'http://localhost/internal/users?is_admin=true&page=2',
  previous: null,
  results: [
    {
      ownerid: 1,
      username: 'user1-codecov',
      email: 'user1@codecov.io',
      name: 'User 1',
      isAdmin: true,
      activated: true,
    },
  ],
  total_pages: 2,
}

const mockSecondResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      ownerid: 2,
      username: 'user2-codecov',
      email: 'user2@codecov.io',
      name: null,
      isAdmin: true,
      activated: true,
    },
  ],
  total_pages: 2,
}

const queryClient = new QueryClient()

const server = setupServer()
beforeAll(() => server.listen())
beforeEach(() => {
  server.resetHandlers()
  queryClient.clear()
})
afterAll(() => server.close())

describe('AdminAccessTable', () => {
  function setup({ noData = false }) {
    server.use(
      rest.get('/internal/users', (req, res, ctx) => {
        if (noData) {
          return res(
            ctx.status(200),
            ctx.json({
              count: 0,
              next: null,
              previous: null,
              results: [],
              total_pages: 0,
            })
          )
        }

        const {
          url: { searchParams },
        } = req

        const pageNumber = Number(searchParams.get('page'))

        if (pageNumber > 1) {
          return res(ctx.status(200), ctx.json(mockSecondResponse))
        }

        return res(ctx.status(200), ctx.json(mockFirstResponse))
      })
    )

    render(
      <QueryClientProvider client={queryClient}>
        <AdminAccessTable />
      </QueryClientProvider>
    )
  }

  describe('renders table', () => {
    beforeEach(() => {
      setup({})
    })

    it('displays the table heading', async () => {
      const admin = await screen.findByText('Admin')
      expect(admin).toBeInTheDocument()
    })
  })

  describe('renders load more button', () => {
    beforeEach(() => {
      setup({})
    })

    it('displays the button', async () => {
      const button = await screen.findByText('Load More')
      expect(button).toBeInTheDocument()
    })
  })

  describe('table displays users', () => {
    beforeEach(() => {
      setup({})
    })

    it('displays an initial user set', async () => {
      const user = await screen.findByText('User 1')
      expect(user).toBeInTheDocument()
    })

    it('displays extended list after button click', async () => {
      const button = await screen.findByText('Load More')
      await userEvent.click(button)

      const user1 = await screen.findByText('User 1')
      expect(user1).toBeInTheDocument()

      const user2 = await screen.findByText('user2-codecov')
      expect(user2).toBeInTheDocument()
    })
  })

  describe('table has no data', () => {
    beforeEach(() => {
      setup({ noData: true })
    })

    it('displays an empty table', async () => {
      const table = await screen.findByTestId('body-row')
      expect(table).toBeEmptyDOMElement()
    })
  })
})