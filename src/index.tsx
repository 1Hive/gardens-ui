import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { AppThemeProvider } from './providers/AppTheme'

ReactDOM.render(<App />, document.getElementById('root'))
ReactDOM.render(
  <AppThemeProvider>
    <App />
  </AppThemeProvider>,
  document.getElementById('root')
)
