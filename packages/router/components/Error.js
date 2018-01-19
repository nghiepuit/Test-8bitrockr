import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Error extends Component {

  render() {
    let { error } = this.props
    return (
      <div>
        Load Failed.
        <div>
          {JSON.stringify(error)}
        </div>
      </div>
    )
  }

}

Error.propTypes = {
  error: PropTypes.any.isRequired,
}
