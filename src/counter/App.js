import React from 'react'
import Counter from './components/Counter'

const App = ({store}) => (<Counter
  value={store.getState()}
  onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
  onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
/>)
export default App
