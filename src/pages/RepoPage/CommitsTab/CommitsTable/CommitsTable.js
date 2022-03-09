import PropTypes from 'prop-types'

import { commitRequestType } from 'shared/propTypes'
import Change from 'ui/Change'
import Table from 'ui/Table'

import CIStatus from './CIStatus'
import Coverage from './Coverage'
import Patch from './Patch'
import Title from './Title'

const headers = [
  {
    Header: 'Name',
    accessor: 'title',
    width: 'w-6/12',
  },
  {
    Header: <span className="w-full text-right">CI status</span>,
    accessor: 'ciStatus',
    width: 'w-2/12 lg:w-3/12',
  },
  {
    Header: (
      <span className="w-full text-right">
        Coverage <span className="hidden lg:inline-block">%</span>
      </span>
    ),
    accessor: 'coverage',
    width: 'w-2/12 lg:w-3/12',
  },
  {
    Header: <span className="w-full text-right">Patch</span>,
    accessor: 'patch',
    width: 'w-1/12',
  },
  {
    Header: <span className="w-full text-right">Change</span>,
    accessor: 'change',
    width: 'w-1/12',
  },
]

const handleOnNull = () => {
  return {
    title: <span className="text-sm">we can&apos;t find this commit</span>,
  }
}

function transformPullToTable(commits) {
  // if there are no repos show empty message
  if (commits.length <= 0) {
    return [
      {
        title: <span className="text-sm">no results found</span>,
      },
    ]
  }

  return commits.map((commit) => {
    if (!commit) return handleOnNull()
    const {
      message,
      author,
      commitid,
      createdAt,
      totals,
      compareWithParent,
      parent,
      ciPassed,
    } = commit
    const change = totals?.coverage - parent?.totals?.coverage

    return {
      title: (
        <Title
          message={message}
          author={author}
          commitid={commitid}
          createdAt={createdAt}
        />
      ),
      ciStatus: (
        <CIStatus
          commitid={commitid}
          coverage={totals?.coverage}
          ciPassed={ciPassed}
        />
      ),
      coverage: <Coverage totals={totals} />,
      patch: <Patch compareWithParent={compareWithParent} />,
      change: <Change value={change} variant="default" />,
    }
  })
}

function CommitsTable({ commits }) {
  const dataTable = transformPullToTable(commits)
  return <Table data={dataTable} columns={headers} />
}

CommitsTable.propTypes = {
  commits: PropTypes.arrayOf(commitRequestType),
}

export default CommitsTable
