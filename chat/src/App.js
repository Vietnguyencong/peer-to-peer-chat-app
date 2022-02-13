import Login from "./component/Login";
import React, { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Dashboard from "./component/Dashboard";
import ContactsProvider from "./context/ContactsProvider";
import ConversationsProvider from "./context/ConversationsProvider";
import { SocketProvider } from "./context/SocketProvider";
import CallProvider from "./context/CallProvider";

function App() {
  const [id, setId] = useLocalStorage("id");

  // console.log("id", id);
  const dash = (
    <SocketProvider id={id}>
      <CallProvider id={id}>
        <ContactsProvider>
          <ConversationsProvider id={id}>
            <Dashboard id={id} />
          </ConversationsProvider>
        </ContactsProvider>
      </CallProvider>
    </SocketProvider>
  );
  return <>{id ? dash : <Login setId={setId} />}</>;
}

export default App;
