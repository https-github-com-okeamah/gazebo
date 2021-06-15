import PropTypes from 'prop-types'
import cs from 'classnames'
import Icon from 'ui/Icon'
import { Menu, MenuList, MenuButton, MenuLink } from '@reach/menu-button'

import AppLink from 'shared/AppLink'
import Avatar from 'ui/Avatar'

import './ContextSwitcher.css'

const styles = {
  button: 'flex items-center text-xl font-semibold',
  image: 'w-6 h-6 rounded-full',
  switchContext: 'px-4 py-2 border-b border-ds-gray-secondary font-semibold',
}

function getCurrentContext({ activeContext, contexts }) {
  return contexts.find((context) => {
    return context.owner.username.toLowerCase() === activeContext?.toLowerCase()
  })
}

function ContextSwitcher({ activeContext, contexts }) {
  const currentContext = getCurrentContext({ activeContext, contexts })

  function renderContext(context) {
    const { owner, pageName } = context
    const isActiveContext = context === currentContext
    return (
      <MenuLink
        as={AppLink}
        pageName={pageName}
        options={{ owner: owner.username }}
        key={owner.username}
      >
        <Avatar user={owner} bordered />
        <div className={cs('mx-2', { 'font-semibold': isActiveContext })}>
          {owner.username}
        </div>
      </MenuLink>
    )
  }

  return (
    <Menu>
      <MenuButton className={styles.button}>
        {activeContext ? (
          <>
            <Avatar user={currentContext.owner} bordered />
            <div className="ml-2 mr-1">{currentContext.owner.username}</div>
          </>
        ) : (
          <>
            <Icon name="home" />
            <div className="ml-2 mr-1">All my orgs and repos</div>
          </>
        )}
        <span aria-hidden="true">
          <Icon variant="solid" name="chevron-down" />
        </span>
      </MenuButton>
      <MenuList>
        <div className={styles.switchContext}>Switch context</div>
        <div className="max-h-64 overflow-y-auto">
          <MenuLink as={AppLink} pageName="provider">
            <Icon name="home" />
            <div className={cs('mx-2', { 'font-semibold': !activeContext })}>
              All orgs and repos
            </div>
          </MenuLink>
          {contexts.map(renderContext)}
        </div>
      </MenuList>
    </Menu>
  )
}

ContextSwitcher.propTypes = {
  activeContext: PropTypes.string,
  contexts: PropTypes.arrayOf(
    PropTypes.shape({
      owner: PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }),
      pageName: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default ContextSwitcher
