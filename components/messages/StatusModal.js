import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import {SendBtn} from '../SendBtn'


export function StatusModal({updateOpen,hideUpdateModal,update, loading, disabled}){
    return (
        <Modal show={updateOpen} onHide={hideUpdateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket status</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are about to mark this ticket as <span className='badge badge-success'>resolved</span></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideUpdateModal}>
            Cancel
          </Button>
          <SendBtn variant="primary" onClick={()=>update()} loading={loading} disabled={disabled}>
            Confirm
          </SendBtn>
        </Modal.Footer>
      </Modal>
    )
}