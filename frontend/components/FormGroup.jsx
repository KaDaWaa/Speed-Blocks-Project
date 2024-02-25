import React from "react";
import { Form } from "react-bootstrap";

export default function FormGroup({ ...props }) {
  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        type={props.type}
        as={props.type === "textarea" ? props.type : undefined}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        autoFocus={props.autoFocus}
        placeholder={props.placeholder}
      />
      <Form.Control.Feedback type="invalid">
        {props.feedback}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
