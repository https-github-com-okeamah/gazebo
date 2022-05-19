import { useMutation } from 'react-query'

import Api from 'shared/api'
import { providerToName } from 'shared/utils'

function getRepoPath({ provider, owner, repo }) {
  return `/${provider}/${owner}/repos/${repo}/`
}

function updateRepo({ provider, owner, repo, body }) {
  const refactoredProvider = providerToName(provider).toLowerCase()
  const path = getRepoPath({
    provider: refactoredProvider,
    owner,
    repo,
  })
  return Api.patch({ path, provider: refactoredProvider, body })
}

export function useUpdateRepo({ provider, owner, repo }) {
  return useMutation(
    ({ ...body }) => updateRepo({ provider, owner, repo, body }),
    {
      onError: (err) => {
        console.log(err)
      },
    }
  )
}
