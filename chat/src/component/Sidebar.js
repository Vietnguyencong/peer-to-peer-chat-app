import React, { useState } from "react";
import { Nav, Tab, Button, Modal } from "react-bootstrap";
import Contacts from "./Contacts";
import Conversations from "./Conversations";
import useLocalStorage from "../hooks/useLocalStorage";
import NewConversationModal from "./NewConversationModal";
import NewContactModal from "./NewContactModal";
import { Icon } from "@iconify/react";
import bxConversation from "@iconify/icons-bx/bx-conversation";
import contactCard24Regular from "@iconify/icons-fluent/contact-card-24-regular";
import idBadgeLine from "@iconify/icons-clarity/id-badge-line";
const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

export default function Sidebar({ id }) {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ width: "27%" }} className="d-flex flex-column">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav
          variant="pills"
          className="d-flex justify-content-between"
          style={{ width: "100%", marginBottom: "2px" }}
        >
          <Nav.Item style={{ width: "50%" }}>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>
              <Icon icon={bxConversation} style={{ fontSize: "24px" }} />{" "}
              CONVERSATION
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ width: "50%" }}>
            <Nav.Link eventKey={CONTACTS_KEY}>
              <Icon icon={contactCard24Regular} style={{ fontSize: "24px" }} />{" "}
              CONTACT
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content
          className="overflow-auto flex-grow-1"
          style={{ borderRight: "1px solid" }}
        >
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <Conversations />
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACTS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>
        <div
          style={{ borderRight: "1px solid" }}
          className="border-top p-2 small"
        >
          <Icon icon={idBadgeLine} style={{ fontSize: "24px" }} />
          Your ID: <span className="text-muted"> {id}</span>
        </div>
        <Button className="rounded-0" onClick={() => setShowModal(true)}>
          {activeKey === CONVERSATIONS_KEY ? (
            <Icon icon={bxConversation} style={{ fontSize: "24px" }} />
          ) : (
            <Icon icon={contactCard24Regular} style={{ fontSize: "24px" }} />
          )}{" "}
          New{" "}
          {activeKey === CONVERSATIONS_KEY ? CONVERSATIONS_KEY : CONTACTS_KEY}
        </Button>
      </Tab.Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {activeKey === CONVERSATIONS_KEY ? (
          <NewConversationModal closeModal={() => setShowModal(false)} />
        ) : (
          <NewContactModal closeModal={() => setShowModal(false)} />
        )}
      </Modal>
    </div>
  );
}
