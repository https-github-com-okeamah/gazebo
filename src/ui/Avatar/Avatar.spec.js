import { render, screen } from '@testing-library/react'
import * as hooks from 'react-image'
import Avatar from '.'

describe('Avatar', () => {
  const args = {
    user: {
      userName: 'andrewyaeger',
      avatarUrl: 'https://avatars0.githubusercontent.com/u/1060902?v=3&s=55',
    },
  }

  it('renders an image with the correct attributes', () => {
    jest.spyOn(hooks, 'useImage').mockImplementation(() => ({
      src: args.user.avatarUrl,
      error: false,
    }))

    render(<Avatar user={args.user} />)

    const img = screen.getByRole('img')

    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', args.user.avatarUrl)
    expect(img).toHaveAttribute('alt', args.user.alt)
  })
})
