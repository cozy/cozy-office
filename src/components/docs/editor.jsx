import React, { useMemo, useState, useEffect } from 'react'

import { withRouter } from 'react-router-dom'
import { queryConnect } from 'cozy-client'

import { getEditUrl } from '../../lib/docserve'
import EditorLoading from './editor-loading'
import doctype from './doctype'
import Icon from 'cozy-ui/transpiled/react/Icon'

const withCollab = true

const Editor = props =>
  useMemo(
    () => {
      const bar = window.cozy.bar
      const { BarRight } = bar
      return (
        <React.Fragment>
          <BarRight>
            <a href={`/`} className="bar-app-close">
              <Icon icon="cross" width={28} height={28} />
            </a>
          </BarRight>
          <iframe className="editor" src={props.url} />
        </React.Fragment>
      )
    },
    [props.url]
  )

const EditorOrSpinner = props => {
  const {
    docs: { data, fetchStatus }
  } = props
  const isLoading = fetchStatus === 'loading' || fetchStatus === 'pending'

  const couchDoc = data && data[0]
  const fakeDoc = useMemo(
    () => {
      if (withCollab) {
        return {
          _id: props.id,
          id: props.id,
          file: props.id,
          fileName: `${props.id}.${props.ext}`,
          ext: props.ext,
          title: 'Document collaboratif en édition publique'
        }
      } else {
        return undefined
      }
    },
    [props.id, withCollab]
  )

  const doc = couchDoc || fakeDoc

  const [url, setUrl] = useState(undefined)

  useEffect(
    () => {
      if (doc && !isLoading) {
        getEditUrl(doc).then(url => setUrl(url))
      }
    },
    [doc && doc.id, isLoading, couchDoc]
  )

  if (!isLoading && !doc) {
    window.setTimeout(() => props.history.push(`/`), 0)
  }

  const showSpinner = isLoading || !doc || !url

  return showSpinner ? <EditorLoading /> : <Editor doc={doc} url={url} />
}

export default ({ match }) => {
  const id = match.params.id
  const ext = match.params.ext
  const query = client => client.find(doctype).where({ _id: id })
  const Component = queryConnect({
    docs: { query, as: 'docs' }
  })(withRouter(EditorOrSpinner))
  return <Component id={id} ext={ext} />
}
