import React, { Component } from 'react'
import { Layout } from './../commons/layout'
import { Link } from 'react-router-dom'
import { addressRef } from '@apis/firebase'
import { StoreBuilder } from 'store'
import { isEmpty, find } from 'lodash'
import styles from './edit_address.styles.scss'
import Proptypes from 'prop-types'
import { geolocated } from 'react-geolocated'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ListAddressActions from './../list_address/list_address.actions'
import * as NotifyConstants from '@commons/constants/Notify'

import { notEmptyInput } from '@commons/utils/input_validation'

class EditAddressContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      street_name: '',
      ward: '',
      district: '',
      city: '',
      country: '',
      errors: [
        {
          field: '',
          message: '',
        },
      ],
    }
  }

  componentWillMount() {
    const { match } = this.props
    if (match !== null) {
      let { params } = match
      let { id } = params
      if (id !== '') {
        addressRef.child(id).on('value', (data) => {
          const value = data.val()
          this.setState({
            street_name: value.street_name,
            ward: value.ward,
            district: value.district,
            city: value.city,
            country: value.country,
          })
        })
      }
    }
  }

  componentWillUnmount() {
    addressRef.off('value')
  }

  onHandleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({
      [name]: value,
    })
  }

  onHandleSubmit = (e) => {
    e.preventDefault()
    const { actions } = this.props
    const { street_name, ward, district, city, country } = this.state
    if (isEmpty(this.onValidateForm())) {
      const { match } = this.props
      if (match !== null) {
        let { params } = match
        let { id } = params
        if (id !== '') {
          addressRef.child(id).update({
            street_name,
            ward,
            district,
            city,
            country,
          })
        }
      }
      actions.changeNotify(NotifyConstants.NOTIFY_TYPE_SUCCESS, NotifyConstants.MSG_UPDATE_ADDRESS_TITLE, NotifyConstants.MSG_UPDATE_ADDRESS_SUCCESS)
      const browserHistory = StoreBuilder.getBrowserHistory()
      browserHistory && browserHistory.push('/address/list')
    }
  }

  onValidateForm = () => {
    const errors = []
    const { street_name, ward, district, city, country } = this.state
    if (!notEmptyInput(street_name)) {
      errors.push({
        field: 'street_name',
        message: 'Street is not empty!',
      })
    }
    if (!notEmptyInput(city)) {
      if (!notEmptyInput(ward)) {
        errors.push({
          field: 'ward',
          message: 'Ward is not empty!',
        })
      }
      if (!notEmptyInput(district)) {
        errors.push({
          field: 'district',
          message: 'District is not empty!',
        })
      }
    }

    this.setState({ errors })
    return errors

  }

  getCurrentLocation = () => {
    if (!this.props.isGeolocationAvailable) {
      console.log('Your browser does not support Geolocation')
      return <div>Your browser does not support Geolocation</div>
    } else if (!this.props.isGeolocationEnabled) {
      console.log('Geolocation is not enabled')
      return <div>Geolocation is not enabled</div>
    } else if (this.props.coords) {
      const { latitude, longitude } = this.props.coords
      this.getMyLocation(latitude, longitude)
    } else {
      console.log('Getting the location data')
      return <div>Getting the location data&hellip; </div>
    }
  }

  getMyLocation = (latitude, longitude) => {
    const api_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAIsrygMZ9cmqzZ8yyY4p3eRjq9NmRUAzc`
    axios.get(api_url)
      .then((response) => {
        if (response.data.status === 'OK') {
          const { results } = response.data
          if (results.length > 0) {
            const { address_components } = results[0]
            if (address_components.length > 0) {
              const street_name = address_components[0] ? address_components[0].long_name : ''
              const ward = address_components[1] ? address_components[1].long_name : ''
              const district = address_components[2] ? address_components[2].long_name : ''
              const city = address_components[3] ? address_components[3].long_name : ''
              const country = address_components[4] ? address_components[4].long_name : ''
              this.setState({
                street_name,
                ward,
                district,
                city,
                country,
              })
            }
          }
        }
      }).catch((error) => {
        console.log(error)
      })
  }

  render() {
    const { street_name, ward, district, city, country, errors } = this.state
    return (
      <Layout>
        <div className='container'>
          <h2 className='text-center text-danger'>Edit Address</h2>
          <button
            className='btn btn-default'
            onClick={this.getCurrentLocation}
          >
            <span className='glyphicon glyphicon-map-marker' />&nbsp;
            Get Current Location
          </button>
          <form onSubmit={this.onHandleSubmit}>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>Street: </label>
                  <input
                    className={find(errors, { field: 'street_name' }) ? `form-control ${styles.errorField}` : `form-control`}
                    name='street_name'
                    value={street_name}
                    onChange={this.onHandleChange}
                  />
                  <span
                    className='label label-danger'
                    style={find(errors, { field: 'street_name' }) ? { opacity: 1 } : { opacity: 0 }}>
                    The street is required!
                  </span>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>City: </label>
                  <input
                    className='form-control'
                    name='city'
                    value={city}
                    onChange={this.onHandleChange}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>Ward: </label>
                  <input
                    className={find(errors, { field: 'ward' }) ? `form-control ${styles.errorField}` : `form-control`}
                    name='ward'
                    value={ward}
                    onChange={this.onHandleChange}
                  />
                  <span
                    className='label label-danger'
                    style={find(errors, { field: 'ward' }) ? { opacity: 1 } : { opacity: 0 }}>
                    The ward is required!
                  </span>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>District: </label>
                  <input
                    className={find(errors, { field: 'district' }) ? `form-control ${styles.errorField}` : `form-control`}
                    name='district'
                    value={district}
                    onChange={this.onHandleChange}
                  />
                  <span
                    className='label label-danger'
                    style={find(errors, { field: 'district' }) ? { opacity: 1 } : { opacity: 0 }}>
                    The district is required!
                  </span>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>Country: </label>
                  <input
                    className='form-control'
                    name='country'
                    value={country}
                    onChange={this.onHandleChange}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <Link className='btn btn-warning' to='/address/list'>
                  <span className='glyphicon glyphicon-hand-left' />&nbsp;
                Back to list
              </Link>
                &nbsp;
              <button className='btn btn-success'>
                  <span className='glyphicon glyphicon-save' />&nbsp;
                Update
              </button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    )
  }
}

EditAddressContainer.propTypes = {
  match: Proptypes.object,
  isGeolocationAvailable: Proptypes.bool,
  isGeolocationEnabled: Proptypes.bool,
  coords: Proptypes.object,
  label: Proptypes.any,
  actions: Proptypes.object,
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({
      changeNotify: ListAddressActions.changeNotify,
    }, dispatch),
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(connect(mapStateToProps, mapDispatchToProps)(EditAddressContainer))

