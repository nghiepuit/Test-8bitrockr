import React, { Component } from 'react'
import { AlertContainer, Alert } from 'react-bs-notifier'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ListAddressActions from './../../list_address/list_address.actions'

class Notify extends Component {

  onHandleDismiss = () => {
    const { actions } = this.props
    actions.hideNotify()
  }

  render() {
    const { isShowNotify, typeOfNotify, titleNotify, contentNotify } = this.props
    if (!isShowNotify) return null
    return (
      <AlertContainer position='top-right'>
        <Alert
          showItem={false}
          headline={titleNotify}
          type={typeOfNotify}
          onDismiss={this.onHandleDismiss}
          timeout={2000}
        >
          {contentNotify}
        </Alert>
      </AlertContainer>
    )
  }

}

Notify.propTypes = {
  actions: PropTypes.object,
  isShowNotify: PropTypes.bool,
  typeOfNotify: PropTypes.string,
  titleNotify: PropTypes.string,
  contentNotify: PropTypes.string,
}

const mapStateToProps = (state) => ({
  isShowNotify: state.get('ListAddressReducers').get('isShowNotify'),
  typeOfNotify: state.get('ListAddressReducers').get('typeOfNotify'),
  titleNotify: state.get('ListAddressReducers').get('titleNotify'),
  contentNotify: state.get('ListAddressReducers').get('contentNotify'),
})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      hideNotify: ListAddressActions.hideNotify,
    }, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notify)
