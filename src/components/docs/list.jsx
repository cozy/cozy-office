import React, { useCallback } from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { queryConnect, withClient } from 'cozy-client'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Menu, { MenuButton } from 'cozy-ui/transpiled/react/MuiCozyTheme/Menus'
import MenuItem from '@material-ui/core/MenuItem'
import { MainTitle } from 'cozy-ui/transpiled/react/Text'

import Add from './add'
import query from './query'
import { titleWithDefault } from './utils'

import HeaderMenu from '../header_menu.jsx'

import icon from '../../assets/icons/doc.svg'

import { getEditUrl } from '../../lib/docserve'

const Item = props => {
  const onClick = useCallback(
    async e => {
      e.preventDefault()
      const url = await getEditUrl(props.doc)
      document.location = url
    },
    [props.doc.id, props.doc.title]
  )

  return (
    <div className="doc-item">
      <Icon icon={icon} width={32} height={32} className="doc-icon" />
      <a onClick={onClick} className="doc-link">
        <ListItemText
          primaryText={titleWithDefault(props.doc)}
          secondaryText="/Documents/2019/demo"
        />
      </a>
    </div>
  )
}

const Options = withClient(props => {
  const rename = useCallback(() => {
    const txt = window.prompt('Nouveau nom', titleWithDefault(props.doc))
    props.client.save({ ...props.doc, title: txt })
  })
  const remove = useCallback(() => {
    props.client.destroy(props.doc)
  })

  return (
    <Menu
      component={
        <MenuButton
          theme="action"
          extension="narrow"
          icon={<Icon icon="dots" color="coolGrey" width="17" height="17" />}
          iconOnly
          label="actions"
        />
      }
    >
      <MenuItem onClick={rename}>Renommer</MenuItem>
      <MenuItem onClick={remove}>Supprimer</MenuItem>
    </Menu>
  )
})

const Row = props => {
  const updatedAt = new Date(props.doc.cozyMetadata.updatedAt)
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const formatedUpdatedAt = updatedAt.toLocaleDateString(undefined, options)
  return (
    <tr className="c-table-row">
      <th className="c-table-cell c-table-cell--primary">
        <Item {...props} />
      </th>
      <td className="c-table-cell">
        <time datatime={props.doc.cozyMetadata.updatedAt}>
          {formatedUpdatedAt}
        </time>
      </td>
      <td className="c-table-cell"> — </td>
      <td className="c-table-cell">
        <Options {...props} />
      </td>
    </tr>
  )
}

const List = props => {
  const { docs } = props
  return !docs || !docs.length ? null : (
    <table className="docs-list c-table">
      <thead className="c-table-head">
        <tr className="c-table-row-head">
          <th className="c-table-header">Nom</th>
          <th className="c-table-header">Dernière mise à jour</th>
          <th className="c-table-header">Partages</th>
          <th className="c-table-header" />
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
          <HeaderMenu
            left={<MainTitle tag="h1">Mes documents</MainTitle>}
            right={<Add />}
          />
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
