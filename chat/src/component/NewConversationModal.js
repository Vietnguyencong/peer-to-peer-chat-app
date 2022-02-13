import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";
import { useConversations } from "../context/ConversationsProvider";

export default function NewConversationModal({ closeModal }) {
  const { contacts } = useContacts();
  const { createConversation } = useConversations();
  const [selectedContactIds, setSelectedContactsIds] = useState([]);

  function hanldleChangeSelectedContactsIds(contactid) {
    setSelectedContactsIds((oldIds) => {
      if (oldIds.includes(contactid)) {
        return oldIds.filter((id) => id !== contactid);
      } else {
        return [...oldIds, contactid];
      }
    });
  }

  function handleSubmit() {
    const newConversationObject = {
      peopleIds: selectedContactIds,
      messages: [],
    };
    createConversation(newConversationObject);
    closeModal();
  }
  return (
    <>
      <Modal.Header>
        <Modal.Title>New Conversation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {contacts.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                value={selectedContactIds.includes(contact.id)}
                label={contact.name}
                onChange={() => hanldleChangeSelectedContactsIds(contact.id)}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Create New Conversation
        </Button>
      </Modal.Footer>
    </>
  );
}
