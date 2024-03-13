import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'

import { useRepo } from './useRepo'

const mockRepo = {
  owner: {
    isCurrentUserPartOfOrg: true,
    isAdmin: null,
    isCurrentUserActivated: null,
    repository: {
      private: false,
      uploadToken: '9e6a6189-20f1-482d-ab62-ecfaa2629295',
      defaultBranch: 'main',
      yaml: '',
      activated: false,
      oldestCommitAt: '',
      active: true,
    },
  },
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const server = setupServer()

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  queryClient.clear()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('useRepo', () => {
  function setup(invalidResponse = false) {
    server.use(
      graphql.query('GetRepo', (req, res, ctx) => {
        if (invalidResponse) {
          return res(ctx.status(200), ctx.data({}))
        }

        return res(ctx.status(200), ctx.data(mockRepo))
      })
    )
  }

  describe('calling hook', () => {
    it('returns the repository details successfully', async () => {
      setup()
      const { result } = renderHook(
        () =>
          useRepo({
            provider: 'gh',
            owner: 'codecov',
            repo: 'cool-repo',
          }),
        { wrapper }
      )

      await waitFor(() => result.current.isSuccess)

      await waitFor(() =>
        expect(result.current.data).toEqual({
          isCurrentUserPartOfOrg: true,
          isAdmin: null,
          isCurrentUserActivated: null,
          repository: {
            private: false,
            uploadToken: '9e6a6189-20f1-482d-ab62-ecfaa2629295',
            defaultBranch: 'main',
            yaml: '',
            activated: false,
            oldestCommitAt: '',
            active: true,
          },
        })
      )
    })

    it('returns an error when unsuccessful', async () => {
      setup(true)
      const { result } = renderHook(
        () =>
          useRepo({
            provider: 'gh',
            owner: 'codecov',
            repo: 'cool-repo',
          }),
        { wrapper }
      )

      await waitFor(() => expect(result.current.isError).toBeTruthy())

      await waitFor(() =>
        expect(result.current.error).toEqual(
          expect.objectContaining({
            status: 404,
          })
        )
      )
    })
  })
})