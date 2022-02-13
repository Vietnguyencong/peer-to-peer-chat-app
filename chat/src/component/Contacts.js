import React, { useEffect } from "react";
import { useContacts } from "../context/ContactsProvider";
import { ListGroup, Button } from "react-bootstrap";
import CallModal from "./CallModal";
import { useCall } from "../context/CallProvider";
import { Icon } from "@iconify/react";
import Delete28Regular from "@iconify/icons-fluent/delete-28-regular";
import bxPhoneCall from "@iconify/icons-bx/bx-phone-call";
import fileEarmarkPerson from "@iconify/icons-bi/file-earmark-person";

export default function Contacts() {
  const { contacts, removeContact } = useContacts();
  const [show, setshow] = React.useState(false);
  const { stop, myStream, setUpStream } = useCall();

  const color = (status) => {
    return status ? "blue" : "red";
  };
  function call(userId) {
    setshow(true);
    setUpStream(userId);
  }
  useEffect(() => {
    if (!show && myStream) {
      stop(myStream);
    }
  }, [show]);
  return (
    <ListGroup variant="flush">
      {contacts.map((contact) => {
        return (
          <>
            <ListGroup.Item
              key={contact.id}
              className="d-flex  align-items-start"
              style={{ justifyContent: "space-between" }}
            >
              <div className="d-flex flex-column">
                <div className="d-flex">
                  <Icon icon={fileEarmarkPerson} style={{ fontSize: "24px" }} />{" "}
                  <strong>{contact.name}</strong>
                </div>
                <div className="text-muted">{contact.id}</div>
                <span style={{ color: color(contact.online) }}>
                  {contact.online ? "online" : "offline"}
                </span>
              </div>
              <div
                className="d-flex flex-column align-items-center"
                style={{ justifyContent: "space-around" }}
              >
                <Button onClick={() => call(contact.id)}>
                  <Icon icon={bxPhoneCall} style={{ fontSize: "24px" }} />
                </Button>
                <Button
                  variant="sm"
                  onClick={() => removeContact(contact.id)}
                  className="mt-2"
                  variant="danger"
                >
                  <Icon style={{ fontSize: "24px" }} icon={Delete28Regular} />
                </Button>
              </div>
            </ListGroup.Item>
          </>
        );
      })}
      {show && <CallModal open={show} setOpen={setshow} />}
    </ListGroup>
  );
}
