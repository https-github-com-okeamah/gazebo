import { useState } from 'react'

import { useLocationParams } from 'services/navigation'
import OptionButton from 'ui/OptionButton'

import { displayTypeParameter } from '../constants'
import useRepoContentsTable from '../subroute/RepoContents/hooks'

const options = [
  {
    text: 'Code tree',
    displayType: displayTypeParameter.tree,
  },
  {
    text: 'File list',
    displayType: displayTypeParameter.list,
  },
]

function DisplayTypeButton() {
  const { data } = useRepoContentsTable()
  const { updateParams } = useLocationParams()
  const [active, setActive] = useState(options[0])

  function handleOnChange(option) {
    updateParams({ displayType: option.displayType.toLowerCase() })
    setActive(option)
  }

  return (
    <div className="flex gap-4 items-center">
      <OptionButton
        active={active}
        options={options}
        onChange={(option) => handleOnChange(option)}
      />
      {active?.displayType === displayTypeParameter.list && data && (
        <span>{data?.length} files</span>
      )}
    </div>
  )
}

export default DisplayTypeButton