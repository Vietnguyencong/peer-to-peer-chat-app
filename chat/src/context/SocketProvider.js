import React from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ id, children }) {
  // console.log("THIS IS ACCESS SOCKET PROVIDER IO CLIENT", id);
  const [socket, setSocket] = React.useState();
  React.useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_HOST, {
      query: {
        id,
      },
    });
    console.log("CONNECT TO THE SOCKET");
    setSocket(newSocket);
    return () => newSocket.close();
  }, [id]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
