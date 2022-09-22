import cs from 'classnames'
import PropTypes from 'prop-types'

import AppLink from 'shared/AppLink'
import Spinner from 'ui/Spinner'

const baseClass = `
  flex justify-center items-center gap-1
  font-semibold rounded py-1 px-4
  transition-colors duration-150 motion-reduce:transition-none

  focus:outline-none focus:ring

  disabled:cursor-not-allowed 
`
const baseDisabledClasses = `disabled:text-ds-gray-quaternary disabled:border-ds-gray-tertiary disabled:bg-ds-gray-primary`
const variantClasses = {
  default: `
    text-ds-gray-octonary bg-ds-gray-primary border-ds-gray-quaternary
    border-solid border shadow

    hover:bg-ds-gray-secondary
  `,
  primary: `
    text-white bg-ds-blue-medium border-ds-blue-quinary
    border-solid border shadow

    hover:bg-ds-blue-darker
  `,
  danger: `
    text-ds-primary-red border-ds-primary-red
    border-solid border shadow

    hover:text-white hover:bg-ds-primary-red
  `,
  secondary: `
    text-white bg-ds-pink border-ds-pink-tertiary
    border-solid border shadow
    hover:bg-ds-pink-tertiary
  `,
  plain: `
    text-ds-gray-quaternary

    hover:text-ds-gray-octonary
  `,
  github: `
    border border-solid border-github
    bg-github hover:bg-white
    text-white hover:text-github
    transition-colors duration-75 ease-in
  `,
  gitlab: `
    border border-solid border-gitlab
    bg-gitlab hover:bg-white
    text-white hover:text-gitlab
    transition-colors duration-75 ease-in
  `,
  bitbucket: `
    border border-solid border-bitbucket
    bg-bitbucket hover:bg-white
    text-white hover:text-bitbucket
    transition-colors duration-75 ease-in
  `,
}

const loadingVariantClasses = {
  default: `disabled:bg-ds-gray-secondary disabled:text-ds-gray-octonary disabled:border-ds-gray-quaternary`,
  primary: `disabled:bg-ds-blue-darker disabled:bg-ds-blue-medium text-white disabled:border-ds-blue-quinary`,
  danger: `disabled:text-white disabled:border-ds-primary-red disabled:bg-ds-primary-red`,
  secondary: `disabled:text-white disabled:border-ds-pink-tertiary disabled:bg-ds-pink`,
}

function pickVariant(variant, loading) {
  const set = loading ? loadingVariantClasses : variantClasses

  return set[variant]
}

function Button({
  to,
  variant = 'default',
  isLoading = false,
  disabled,
  hook,
  children,
  ...props
}) {
  const className = cs(
    baseClass,
    { [baseDisabledClasses]: !isLoading },
    pickVariant(variant, isLoading)
  )

  const content = (
    <>
      {isLoading && (
        <span className="text-white mr-0.5">
          <Spinner />
        </span>
      )}
      {children}
    </>
  )

  const completeProps = {
    ...props,
    disabled: disabled || isLoading,
    className,
    children: content,
  }

  return to ? (
    <AppLink {...to} {...completeProps}>
      {content}
    </AppLink>
  ) : (
    <button
      {...completeProps}
      className={className}
      data-cy={hook}
      data-marketing={hook}
      data-testid={hook}
    >
      {content}
    </button>
  )
}

Button.propTypes = {
  to: PropTypes.shape(AppLink.propTypes),
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'danger',
    'secondary',
    'plain',
    'github',
    'gitlab',
    'bitbucket',
  ]),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  hook: function (props, propName) {
    if (
      props['to'] === undefined &&
      (props[propName] === undefined || typeof props[propName] != 'string')
    ) {
      return new Error(
        'If not using prop "to" you must provide prop "hook" of type string.'
      )
    }
  },
}

export default Button