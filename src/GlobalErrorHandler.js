import React from 'react'
import PropTypes from 'prop-types'
import DAONotFoundError from '@components/Errors/DAONotFoundError'
import GenericError from '@components/Errors/GenericError'
import GlobalErrorScreen from '@components/Errors/GlobalErrorScreen'

import { DAONotFound } from './errors'

class GlobalErrorHandler extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = { error: null, errorStack: null }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorStack: errorInfo.componentStack
        .replace(/^\n+|\n+$/g, '')
        .replace(/^ {4}/gm, ''),
    })

    // Once this point is reached, the app can not recover because the routing
    // system, being below this component in the tree, is not functional
    // anymore. To make hash changes work despite this (e.g. by pressing the
    // back button in the browser), the page need to be reloaded.
    window.removeEventListener('hashchange', this.handleHashchange)
    window.addEventListener('hashchange', this.handleHashchange)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashchange)
  }

  handleHashchange = () => {
    window.location.reload()
  }

  render() {
    const { children } = this.props
    const { error, errorStack } = this.state

    return error ? (
      <GlobalErrorScreen>
        {error instanceof DAONotFound ? (
          <DAONotFoundError chainId={error.chainId} daoId={error.dao} />
        ) : (
          <GenericError
            detailsTitle={error.message}
            detailsContent={errorStack}
          />
        )}
      </GlobalErrorScreen>
    ) : (
      children
    )
  }
}

export default GlobalErrorHandler
