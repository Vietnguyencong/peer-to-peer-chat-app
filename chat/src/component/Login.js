import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

export default function Login({ setId }) {
  function handleSubmit(e) {
    e.preventDefault();
    const id = uuidv4();
    console.log({ id });
    setId(id);
  }
  return (
    <Container
      className="d-flex align-items-center"
      style={{ height: "100vh" }}
    >
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter your ID</Form.Label>
          <Form.Control type="text" placeholder="Your ID" />
          <Form.Text className="text-muted">Put your ID above!</Form.Text>
        </Form.Group>

        <Button variant="primary" style={{ marginRight: "3px" }} type="submit">
          Enter
        </Button>
        <Button variant="secondary" type="submit">
          Create your account
        </Button>
      </Form>
    </Container>
  );
}
