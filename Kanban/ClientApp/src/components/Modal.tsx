import React from 'react'
import { Form } from './Form/Form';
import { getIssueById } from "../util/issueFormUtil"

export function Modal(props: any) {
  if (!props.showModal) { return null; }
  return (
    <div id="modal" >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add an Issue to the Board</h2>
          <button className="toggle-button btn btn-danger" onClick={(e) => props.toggleModal(e)}>close</button>
        </div>
        <Form form={props.form} fillValues={props.issue} afterSubmit={(resp: any) => { if (resp.success) { props.refreshBoard(); props.toggleModal(null) } else alert("Failed to submit form") }}></Form>
      </div>
    </div>
  )
}