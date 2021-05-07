import PropTypes from 'prop-types'

import { Menu, MenuList, MenuButton, MenuLink } from '@reach/menu-button'
import AppLink from 'shared/AppLink'
import Avatar from 'ui/Avatar'
import Icon from 'ui/Icon'

function Dropdown({ user }) {
  return (
    <div data-testid="dropdown">
      <Menu>
        <MenuButton className="flex items-center justify-between">
          <Avatar user={user} bordered={true} />
          <div className="ml-1">
            <Icon size={'sm'} name="dropdown-arrow" variant={'solid'} />
          </div>
        </MenuButton>
        <MenuList>
          <MenuLink as={AppLink} pageName={'account'}>
            Settings
          </MenuLink>
          <MenuLink as={AppLink} pageName={'provider'}>
            Organizations
          </MenuLink>
          <MenuLink as={AppLink} pageName={'signOut'}>
            Sign Out
          </MenuLink>
        </MenuList>
      </Menu>
    </div>
  )
}

Dropdown.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
}

export default Dropdown
