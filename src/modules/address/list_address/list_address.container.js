import React, { Component } from 'react'
import { Layout } from './../commons/layout'
import { addressRef } from '@apis/firebase'
import { Link } from 'react-router-dom'
import { CSVLink, CSVDownload } from 'react-csv'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ListAddressActions from './list_address.actions'
import * as NotifyConstants from '@commons/constants/Notify'
import Proptypes from 'prop-types'

class ListAddressContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      items: [],
    }
  }

  componentWillMount() {
    addressRef.on('value', items => {
      let data = []
      items.forEach(item => {
        const { street_name, ward, district, city, country } = item.val()
        data.push({ street_name, ward, district, city, country, key: item.key })
      })
      this.setState({ items: data })
    })
  }

  componentWillUnmount() {
    addressRef.off('value')
  }

  onHandleDelete = (key) => {
    const { actions } = this.props
    addressRef.child(key).remove()
    actions.changeNotify(NotifyConstants.NOTIFY_TYPE_SUCCESS, NotifyConstants.MSG_DELETE_ADDRESS_TITLE, NotifyConstants.MSG_DELETE_ADDRESS_SUCCESS)
  }

  render() {
    let { items } = this.state
    const data = []
    if (items.length <= 0) return null
    let xhtml = items.map((item, index) => {
      data.push({
        streetname : item.street_name,
        ward : item.ward,
        district : item.district,
        city : item.city,
        country : item.country,
      })
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.street_name}</td>
          <td>{item.ward}</td>
          <td>{item.district}</td>
          <td>{item.city}</td>
          <td>{item.country}</td>
          <td>
            <Link to={`/address/edit/${item.key}`} className='btn btn-warning'>
              <span className='glyphicon glyphicon-pencil' />&nbsp;
              Edit
            </Link>&nbsp;
            <button className='btn btn-primary' onClick={() => this.onHandleDelete(item.key)}>
              <span className='glyphicon glyphicon-trash' />&nbsp;
              Delete
            </button>
          </td>
        </tr>
      )
    })

    return (
      <Layout>
        <Link to='/address/create' className='btn btn-default'>
          <span className='glyphicon glyphicon-plus' />&nbsp;
          Add new address
        </Link>&nbsp;
        <CSVLink data={data} className='btn btn-default pull-right' filename='address.csv'>
          <span className='glyphicon glyphicon-list-alt' />&nbsp;
          Export CSV
        </CSVLink>
        <hr />
        <table className='table table-bordered table-hover table-striped'>
          <thead>
            <tr>
              <th>#</th>
              <th>Street Name</th>
              <th>Ward</th>
              <th>District</th>
              <th>City</th>
              <th>Country</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {xhtml}
          </tbody>
        </table>
      </Layout>
    )
  }
}

ListAddressContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ListAddressContainer)
