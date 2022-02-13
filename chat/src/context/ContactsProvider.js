import React, { useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSocket } from "./SocketProvider";

const ContactsContext = React.createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export default function ContactsProvider({ children }) {
  const socket = useSocket();
  const [contacts, setContacts] = useLocalStorage("contacts", []);

  function createContact(id, name) {
    setContacts((prevContacts) => {
      return [...prevContacts, { id, name }];
    });
    socket.emit("check-online-status", id);
  }
  function removeContact(id) {
    setContacts((prevContacts) => {
      return prevContacts.filter((contact) => contact.id !== id);
    });
  }
  function updateOnlineStatus(senderId) {
    setContacts((contactList) => {
      return contactList.map((contact) => {
        if (contact.id === senderId) {
          return { ...contact, online: true };
        }
        return contact;
      });
    });
  }

  function updateOfflineStatus(senderId) {
    setContacts((contactList) => {
      return contactList.map((contact) => {
        if (contact.id === senderId) {
          return { ...contact, online: false };
        }
        return contact;
      });
    });
  }

  useEffect(() => {
    if (socket == null) return;
    socket.on("hello-from", updateOnlineStatus);
    socket.on("bye-from", updateOfflineStatus);
    contacts.forEach((contact) => {
      // console.log("running this effect in contact provider", contact.id);
      socket.emit("check-online-status", contact.id);
    });
    return () => {
      socket.off("hello-from");
      socket.off("bye-from");
    };
  }, [socket]);

  return (
    <ContactsContext.Provider
      value={{ contacts, createContact, removeContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
}
