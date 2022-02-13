import React, { useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export default function ConversationsProvider({ children, id }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const { contacts } = useContacts();
  const socket = useSocket();
  function createConversation(newConversationObject) {
    //check if the peopleIds already exists
    console.log("create conversation");
    const peopleIds = newConversationObject.peopleIds;

    setConversations((prevConversations) => {
      const con = prevConversations.find((conver) => {
        const currentPplIds = conver.peopleIds;
        return compareArray(peopleIds, currentPplIds);
      });
      if (!con) {
        return [...prevConversations, newConversationObject];
      }
      return prevConversations;
    });
  }
  function deleteConversation(conObj) {
    const peopleIds = conObj.peopleIds;
    setConversations((prevConversations) => {
      return prevConversations.filter((con) => {
        return !compareArray(peopleIds, con.peopleIds);
      });
    });
  }
  // there should be only one acctive
  function selectConversation(conversation) {
    console.log("select conversation");
    setConversations((currentConversations) => {
      return currentConversations.map((con) => {
        if (con.active) {
          con.active = false;
        }
        if (compareArray(con.peopleIds, conversation.peopleIds)) {
          con.active = true;
        }
        return con;
      });
    });
  }
  const activeConversation = conversations.find((con) => con.active === true);

  function conversationName(conversation) {
    let res = [];
    conversation.peopleIds.map((id) => {
      // console.log({ contacts });
      const person = contacts.find((contact) => {
        // console.log({ contact });
        return contact.id === id;
      });
      const personName = (person && person.name) || id;
      res.push(personName);
    });
    return res.join(", ");
  }

  function contactName(contactId) {
    // console.log("contact Name", contactId);
    const person = contacts.find((contact) => {
      // console.log({ contact });
      return contact.id === contactId;
    });
    return (person && person.name) || contactId;
  }

  const appendMessageToConversation = ({ peopleIds, sender, text }) => {
    // console.log({ peopleIds, sender, text });
    // console.log("append message to conversation", text);
    setConversations((prevConversations) => {
      // check if it found the converstaion in the conversation list
      let updated = false;
      const updatedConversations = prevConversations.map((con) => {
        if (compareArray(con.peopleIds, peopleIds)) {
          updated = true;
          return {
            ...con,
            messages: [...con.messages, { sender, text }],
          };
        }
        return con;
      });
      if (!updated) {
        // adding the completely new conversation with the messages
        return [
          ...prevConversations,
          { peopleIds, messages: [{ sender, text }] },
        ];
      } else {
        return updatedConversations;
      }
    });
  };
  function sendMessage(peopleIds, text) {
    console.log("send message", text);
    socket.emit("send-message", {
      peopleIds: peopleIds,
      text,
    });
    appendMessageToConversation({ peopleIds, sender: id, text });
  }

  useEffect(() => {
    if (socket == null) return;
    // console.log("running the message");
    socket.on("receive-message", appendMessageToConversation);
    return () => socket.off("receive-message");
  }, [socket]);
  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        createConversation,
        selectConversation,
        activeConversation,
        conversationName,
        deleteConversation,
        sendMessage,
        contactName,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

// util compare 2 arrays
function compareArray(ar1, ar2) {
  const arr1 = [...ar1].sort();
  const arr2 = [...ar2].sort();
  return arr1.join("") === arr2.join("");
}
