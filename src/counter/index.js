import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import App from './App'

import counter from './reducers'
const store = createStore(counter)

const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
  <App store={store} />,
  rootEl
)

render()
store.subscribe(render)
