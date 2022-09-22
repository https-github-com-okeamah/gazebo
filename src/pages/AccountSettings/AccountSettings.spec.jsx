import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

import config from 'config'

import { useIsCurrentUserAnAdmin, useUser } from 'services/user'

import AccountSettings from './AccountSettings'

jest.mock('config')
jest.mock('layouts/MyContextSwitcher', () => () => 'MyContextSwitcher')
jest.mock('services/user/hooks')

jest.mock('./tabs/Admin', () => () => 'AdminTab')
jest.mock('./tabs/Access', () => () => 'AccessTab')
jest.mock('../NotFound', () => () => 'NotFound')
jest.mock('./tabs/YAML', () => () => 'YAMLTab')
jest.mock('./AccountSettingsSideMenu', () => () => 'AccountSettingsSideMenu')

describe('AccountSettings', () => {
  function setup({ url = [], isAdmin = false, isSelfHosted = false }) {
    config.IS_ENTERPRISE = isSelfHosted
    useUser.mockReturnValue({
      data: {
        user: {
          username: 'codecov',
        },
      },
    })

    useIsCurrentUserAnAdmin.mockReturnValue(isAdmin)

    render(
      <MemoryRouter initialEntries={[url]}>
        <Route path="/account/:provider/:owner/">
          <AccountSettings />
        </Route>
      </MemoryRouter>
    )
  }

  describe('when not running in self hosted mode', () => {
    describe('when attempting to access admin tab', () => {
      describe('when user is an admin', () => {
        beforeEach(() => {
          setup({
            url: '/account/gh/codecov',
            isAdmin: true,
          })
        })

        it('renders the admin tab', async () => {
          const tab = await screen.findByText('AdminTab')

          expect(tab).toBeInTheDocument()
        })
      })

      describe('when user is not an admin', () => {
        beforeEach(() => {
          setup({
            url: '/account/gh/codecov',
            isAdmin: false,
          })
        })

        it('redirects to yaml tab', async () => {
          const tab = await screen.findByText('YAMLTab')

          expect(tab).toBeInTheDocument()
        })
      })
    })

    describe('when attempting to access yaml tab', () => {
      beforeEach(() => {
        setup({
          url: '/account/gh/codecov/yaml',
        })
      })

      it('renders the yaml tab', async () => {
        const tab = await screen.findByText('YAMLTab')

        expect(tab).toBeInTheDocument()
      })
    })

    describe('when attempting to access access tab', () => {
      beforeEach(() => {
        setup({
          url: '/account/gh/codecov/access',
        })
      })

      it('renders access tab', async () => {
        const tab = await screen.findByText('AccessTab')

        expect(tab).toBeInTheDocument()
      })
    })
  })

  describe('when running in self hosted mode', () => {
    describe('when attempted to access the admin tab', () => {
      beforeEach(() => {
        setup({
          url: '/account/gh/codecov',
          isSelfHosted: true,
        })
      })

      it('redirects to the yaml tab', async () => {
        const tab = await screen.findByText('YAMLTab')

        expect(tab).toBeInTheDocument()
      })
    })

    describe('when navigating to the yaml tab', () => {
      beforeEach(() => {
        setup({
          url: '/account/gh/codecov/yaml',
          isSelfHosted: true,
        })
      })

      it('renders the yaml tab', async () => {
        const tab = await screen.findByText('YAMLTab')

        expect(tab).toBeInTheDocument()
      })
    })
  })
  describe('when going to an unknown page', () => {
    beforeEach(() => {
      setup({
        url: '/account/gh/codecov/ahhhhhhhhh',
      })
    })
    it('renders not found tab', async () => {
      const tab = await screen.findByText('NotFound')

      expect(tab).toBeInTheDocument()
    })
  })
})