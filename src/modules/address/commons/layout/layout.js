import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Notify } from './../notify'

export default class Layout extends Component {
  render() {
    const { children } = this.props
    return (
      <div>
        <Notify />
        <div className='navbar navbar-inverse'>
          <ul className='nav navbar-nav'>
            <li className='active'>
              <a>Address of VietNam</a>
            </li>
          </ul>
        </div>
        <div className='container'>
          {children}
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.any,
}
