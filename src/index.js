import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './globals.css'
import reportWebVitals from './reportWebVitals'

import ErrorBoundary from 'layouts/shared/ErrorBoundary'

import 'sentry.js'

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
