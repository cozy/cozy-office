import React from 'react'

import { Editor } from '@atlaskit/editor-core'

import { Link } from 'react-router-dom'

import Button from 'cozy-ui/react/Button'
import { MainTitle } from 'cozy-ui/react/Text'
import Icon from 'cozy-ui/react/Icon'
import Input from 'cozy-ui/react/Input'

import editorConfig from './editor_config'

import HeaderMenu from '../header_menu'

export default function (props) {
  const {
    defaultValue,
    onTitleChange,
    onContentChange,
    defaultTitle,
    collabProvider
  } = props
  console.log("props", props)

  const left = <React.Fragment>
    <Button
      icon="back"
      tag={Link}
      to="/"
      className="sto-app-back"
      subtle
    />
    <MainTitle tag="h1" className="doc-title">
      <Input
        fullwidth={true}
        defaultValue={defaultValue.title}
        onChange={onTitleChange}
        readOnly={!onTitleChange}
        placeholder={defaultTitle}
        className='doc-title-input'
      />
    </MainTitle>
  </React.Fragment>

  return <article className="doc-article">
    <style>#coz-bar {'{ display: none }'}</style>
    <HeaderMenu left={left} className="doc-header-menu--editing" />
    <section className='doc-editor-container'>
      <Editor
        collabEdit={collabProvider}
        onChange={onContentChange}
        defaultValue={defaultValue.content}
        {...editorConfig}
        appearance="full-page"
        placeholder="Que voulez-vous dire ?"
        shouldFocus={true}
      />
    </section>
  </article>

}
