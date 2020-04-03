/// <reference types="cypress" />
import React from 'react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {mount} from 'cypress-react-unit-test'
import {CounterComponent} from './Counter'

describe('Counter with hooks', () => {
  it('works', () => {
    const reducers = (state = 0, action) => {
      switch (action.type) {
        default:
          return {counter: 0}
      }
    }

    const store = createStore(reducers)
    mount(
      <Provider store={store}>
        <CounterComponent />
      </Provider>
    )
  })
})
