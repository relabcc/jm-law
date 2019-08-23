import React, { PureComponent, Fragment, createElement } from 'react';

import Button from './Button'
import Modal from './Modal'

class ModalButton extends PureComponent {
  static defaultProps = {
    is: Button,
  }

  state = {}

  openModal = () => this.setState({ open: true })
  closeModal = () => this.setState({ open: false })

  render() {
    const { is, label, title, children, ...props } = this.props
    const { open } = this.state
    return (
      <Fragment>
        {createElement(is, {
          onClick: this.openModal,
          ...props
        }, label)}
        <Modal isOpen={open} onRequestClose={this.closeModal} title={title}>
          {children}
        </Modal>
      </Fragment>
    );
  }
}

export default ModalButton;
