import { useStripe } from '@stripe/react-stripe-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route } from 'react-router-dom'

import { useUpdateCard } from './useUpdateCard'

jest.mock('@stripe/react-stripe-js')

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper =
  (initialEntries = '/gh') =>
  ({ children }) =>
    (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntries]}>
          <Route path="/:provider">{children}</Route>
        </MemoryRouter>
      </QueryClientProvider>
    )

const provider = 'gh'
const owner = 'codecov'

const accountDetails = {
  plan: {
    marketingName: 'Pro Team',
    baseUnitPrice: 12,
    benefits: ['Configurable # of users', 'Unlimited repos'],
    quantity: 5,
    value: 'users-inappm',
  },
  activatedUserCount: 2,
  inactiveUserCount: 1,
}

const server = setupServer()

beforeAll(() => {
  // console.error = () => {}
  server.listen()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useUpdateCard', () => {
  const card = {
    last4: '1234',
  }

  function setupStripe({ createPaymentMethod }) {
    useStripe.mockReturnValue({
      createPaymentMethod,
    })
  }

  describe('when called', () => {
    describe('when the mutation is successful', () => {
      beforeEach(() => {
        setupStripe({
          createPaymentMethod: jest.fn(
            () =>
              new Promise((resolve) => {
                resolve({
                  paymentMethod: {
                    id: 1,
                  },
                })
              })
          ),
        })

        server.use(
          rest.patch(
            `/internal/${provider}/${owner}/account-details/update_payment`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(accountDetails))
            }
          )
        )
      })

      it('returns the data from the server', async () => {
        const { result, waitFor } = renderHook(
          () => useUpdateCard({ provider, owner }),
          {
            wrapper: wrapper(),
          }
        )

        result.current.mutate(card)

        await waitFor(() => expect(result.current.data).toEqual(accountDetails))
      })
    })

    describe('when the mutation is not successful', () => {
      const error = {
        message: 'not good',
      }

      beforeEach(() => {
        setupStripe({
          createPaymentMethod: jest.fn(
            () =>
              new Promise((resolve) => {
                resolve({
                  error,
                })
              })
          ),
        })

        server.use(
          rest.patch(
            `/internal/${provider}/${owner}/account-details/update_payment`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(accountDetails))
            }
          )
        )
      })

      it('does something', async () => {
        const { result, waitFor } = renderHook(
          () => useUpdateCard({ provider, owner }),
          {
            wrapper: wrapper(),
          }
        )

        result.current.mutate(card)

        await waitFor(() => result.current.error)

        // await waitFor(() => expect(result.current.error).toEqual(error))
        expect(result.current.error).toEqual(error)
      })
    })
  })
})