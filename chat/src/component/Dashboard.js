import React from "react";
import { useCall } from "../context/CallProvider";
import { useSocket } from "../context/SocketProvider";
import CallModalReceive from "./CallModalReceive";
import OpenConversation from "./OpenConversation";
import Sidebar from "./Sidebar";

export default function Dashboard({ id }) {
  const [show, setShow] = React.useState(false);
  const socket = useSocket();
  const { answerCall, stop, myStream } = useCall();
  const [accept, setAccept] = React.useState(false);
  function handleAccept() {
    setAccept(true);
    answerCall();
  }
  React.useEffect(async () => {
    if (socket == null) return;
    socket.on("receive-call", ({ senderId }) => {
      console.log({ senderId });
      setShow(true);
    });
    return () => {
      socket.off("receive-call");
    };
  }, [socket]);
  React.useEffect(() => {
    if (!show && myStream) {
      stop(myStream);
    }
  }, [show]);
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar id={id} />
      <OpenConversation id={id} />
      {show && (
        <CallModalReceive
          open={show}
          setOpen={setShow}
          handleAccept={handleAccept}
          accept={accept}
          setAccept={setAccept}
        />
      )}
    </div>
  );
}
