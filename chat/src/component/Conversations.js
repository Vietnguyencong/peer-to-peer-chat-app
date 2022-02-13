import React from "react";
import { useConversations } from "../context/ConversationsProvider";
import { useContacts } from "../context/ContactsProvider";
import { ListGroup } from "react-bootstrap";
import { Icon } from "@iconify/react";
import Delete28Regular from "@iconify/icons-fluent/delete-28-regular";
import { Button } from "react-bootstrap";

export default function Conversations() {
  const {
    conversations,
    selectConversation,
    conversationName,
    deleteConversation,
  } = useConversations();

  return (
    <ListGroup variant="flush">
      {conversations.map((con, id) => {
        return (
          <ListGroup.Item
            key={id}
            action
            onClick={() => selectConversation(con)}
            active={con.active}
            className="d-flex justify-content-between align-items-center"
          >
            <strong>{conversationName(con)}</strong>
            <Button
              onClick={() => deleteConversation(con)}
              className="mt-2"
              variant="danger"
              size="sm"
            >
              <Icon style={{ fontSize: "24px" }} icon={Delete28Regular} />
            </Button>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
