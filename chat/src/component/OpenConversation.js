import React, { useEffect, useState, useRef } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useConversations } from "../context/ConversationsProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import { Icon } from "@iconify/react";
import sendIcon from "@iconify/icons-akar-icons/send";

export default function OpenConversation({ id }) {
  const [text, setText] = useState("");
  const lastDiv = useRef();
  const { sendMessage, conversationName, activeConversation, contactName } =
    useConversations();
  function handleSubmit(e) {
    e.preventDefault();
    // owner is the sender to this message
    sendMessage(activeConversation.peopleIds, text);
    setText("");
  }
  function you(currentId) {
    return currentId === id;
  }

  useEffect(() => {
    if (lastDiv.current) {
      lastDiv.current.scrollIntoView({ smooth: true });
    }
  }, [sendMessage]);

  return (
    <div
      className="d-flex flex-column flex-grow-1"
      style={{ paddingLeft: "5px" }}
    >
      <div className="flex-grow-1 overflow-auto">
        <div
          className={`d-flex flex-column align-items-${"end"} justify-content px-3`}
        >
          {activeConversation &&
            activeConversation.messages &&
            activeConversation.messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`my-1 d-flex flex-column ${
                    you(message.sender)
                      ? "align-items-end"
                      : "align-items-start"
                  }
                  ${
                    you(message.sender) ? "align-self-end" : "align-self-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded border ${
                      you(message.sender) ? "bg-primary text-white" : ""
                    }`}
                  >
                    {message.text}{" "}
                  </div>
                  <div className="text-muted small">
                    {you(message.sender) ? "you" : contactName(message.sender)}
                  </div>
                </div>
              );
            })}
          <div ref={lastDiv}></div>
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "60px", resize: "none" }}
            ></Form.Control>
            <Button type="submit">
              <Icon icon={sendIcon} style={{ fontSize: "24px" }} /> Send
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
}
