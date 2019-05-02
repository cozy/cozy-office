import React from 'react'

import Spinner from 'cozy-ui/react/Spinner'
import { Link } from 'react-router-dom'

import { queryConnect } from 'cozy-client'
import ListItemText from 'cozy-ui/react/ListItemText'
import Button from 'cozy-ui/react/Button'
import Icon from 'cozy-ui/react/Icon'
import { MainTitle } from 'cozy-ui/react/Text'

import Add from './add'
import query from './query'
import { titleWithDefault } from './utils'

import HeaderMenu from '../header_menu.jsx'

import icon from '../../assets/icons/icon-doc-32.svg'

const Item = props => <div className="doc-item">
  <Icon icon={icon} width={32} height={32} className="doc-icon" />
  <Link to={`/d/${props.doc.id}`} className="doc-link">
    <ListItemText
      primaryText={titleWithDefault(props.doc)}
      secondaryText='/Documents/2019/demo'
    />
  </Link>
</div>

const Row = props => {
  const updatedAt = new Date(props.doc.cozyMetadata.updatedAt)
  const options = { day: "numeric", month: "long", year: "numeric" }
  const formatedUpdatedAt = updatedAt.toLocaleDateString(undefined, options)
  return <tr class="c-table-row">
    <th class="c-table-cell c-table-cell--primary">
      <Item {...props} />
    </th>
    <td class="c-table-cell">
      <time datatime={props.doc.cozyMetadata.updatedAt}>
        {formatedUpdatedAt}
      </time>
    </td>
    <td class="c-table-cell">
      —
    </td>
    <td class="c-table-cell">
      <Button
        theme="action"
        extension="narrow"
        icon={<Icon icon="dots" color="coolGrey" width="17" height="17" />}
        iconOnly
        label='actions'
      />
    </td>
  </tr>
}

const List = props => {
  const { docs } = props
  return !docs || !docs.length ? null : (
    <table className="docs-list c-table">
      <thead class="c-table-head">
        <tr class="c-table-row-head">
          <th class="c-table-header">Nom</th>
          <th class="c-table-header">Dernière mise à jour</th>
          <th class="c-table-header">Partages</th>
          <th class="c-table-header"></th>
        </tr>
      </thead>
      <tbody>
        {docs.map(doc => (
          <Row key={doc._id} doc={doc} />
        ))}
      </tbody>
    </table>
  )
}

const ConnectedList = props => {
  const { data, fetchStatus } = props.docs
  // cozy-client statuses
  const isLoading = fetchStatus === 'loading' || fetchStatus === 'pending'
  return (
    <div className="docs docs-list-container">
      {isLoading ? (
        <Spinner size="xxlarge" middle />
      ) : (
        <div>
          <HeaderMenu left={<MainTitle tag="h1">Mes documents</MainTitle>} right={<Add />} />
          <List docs={data} />
        </div>
      )}
    </div>
  )
}

export default queryConnect({
  docs: {
    query: query,
    as: 'docs'
  }
})(ConnectedList)
