import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter, Route } from 'react-router-dom'

import { useUser } from 'services/user'
import { useFlags } from 'shared/featureFlags'

import { useIsPersonalAccount } from './hooks'

jest.mock('services/user')
jest.mock('shared/featureFlags')

const queryClient = new QueryClient({})

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/gh/codecov/']}>
    <Route path="/:provider/:owner">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Route>
  </MemoryRouter>
)

describe('useIsPersonalAccount', () => {
  let hookData
  function setup(username = '') {
    useFlags.mockReturnValue({
      gazeboPlanTab: true,
    })
    useUser.mockReturnValue({
      data: {
        user: {
          username,
        },
      },
    })

    hookData = renderHook(() => useIsPersonalAccount(), {
      wrapper,
    })
  }

  describe('When render with different username', () => {
    beforeEach(() => {
      setup()
    })

    it('Account is not personal', () => {
      expect(hookData.result.current).toBeTruthy()
    })
  })

  describe('When render with same username', () => {
    beforeEach(() => {
      setup('codecov')
    })

    it('Account is personal', () => {
      expect(hookData.result.current).toBeFalsy()
    })
  })
})
