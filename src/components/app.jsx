import React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch, HashRouter } from 'react-router-dom'

import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'

import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import { Sprite as IconSprite } from 'cozy-ui/transpiled/react/Icon'

import { List, Editor } from './docs'

const App = () => (
  //
  <HashRouter>
    <Layout>
      <Main>
        <Content className="app-content">
          <Switch>
            <Route path="/d/:ext/:id" component={Editor} />
            <Route path="/" component={List} />
          </Switch>
        </Content>
      </Main>
      <IconSprite />
    </Layout>
  </HashRouter>
)

/*
  Enable Hot Module Reload using `react-hot-loader` here
  We enable it here since App is the main root component
  No need to use it anywhere else, it sould work for all
  child components
*/
export default hot(module)(App)
