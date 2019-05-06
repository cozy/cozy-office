import React, { Component } from 'react'

import { withClient } from 'cozy-client'

import { withRouter } from 'react-router-dom'

import uuidv4 from 'uuid/v4'

import Button from 'cozy-ui/react/Button'

import doctype from './doctype'

import { createDocument, getEditUrl } from '../../lib/docserve'

class Add extends Component {
  constructor(props, context) {
    super(props, context)
    // initial component state
    this.state = {
      isWorking: false
    }
  }

  handleClick = async e => {
    this.setState(() => ({
      isWorking: true
    }))
    const id = uuidv4()
    const target = e.target
    const getButton = function(node) {
      if (!node || node.nodeName === 'HTML') {
        throw new Error("Can't find a button target")
      } else if (node.dataset.ext) {
        return node
      } else {
        return getButton(node.parentNode)
      }
    }
    const button = getButton(target)
    // create on document server
    const meta = await createDocument(id, button.dataset.ext)
    // create on instance's couchdb
    const { data: doc } = await this.props.client.create(doctype, meta)
    this.setState(() => ({
      isWorking: false
    }))
    window.location = await getEditUrl(doc)
  }

  render() {
    const { isWorking } = this.state
    return (
      <div>
        <Button
          onClick={this.handleClick}
          type="submit"
          busy={isWorking}
          icon="plus"
          data-ext="docx"
          label="ajouter un document"
          extension="narrow"
        />
        {/*<Button
          onClick={this.handleClick}
          type="submit"
          busy={isWorking}
          data-ext="docx"
          label="une feuille de calcul"
          extension="narrow"
        />
        <Button
          onClick={this.handleClick}
          type="submit"
          busy={isWorking}
          data-ext="docx"
          label="une présentation"
          extension="narrow"
        />*/}
      </div>
    )
  }
}

// get mutations from the client to use createDocument
export default withClient(withRouter(Add))
