import React, { useState, useContext, useEffect } from "react";
import Peer from "peerjs";
import { useSocket } from "./SocketProvider";
// import { useUserMedia } from "../hooks/useUserMedia";

const CallContext = React.createContext();
const CAPTURE_OPTIONS = {
  audio: true,
  video: true,
};
const PEER_SERVER_CONFIG = {
  host: process.env.REACT_APP_PEER_HOST,
  port: process.env.REACT_APP_PORT,
  path: "/peerjs/myapp",
  secure: process.env.REACT_APP_SECURE_CONNECT === "false" ? false : true,
};

// console.log(process.env.REACT_APP_PEER_HOST);

// console.log(process.env.REACT_APP_PORT);
export function useCall() {
  return useContext(CallContext);
}

export default function CallProvider({ id, children }) {
  const [myPeer, setMyPeer] = useState();
  const [userStream, setUserStream] = useState();
  const [myStream, setMyStream] = useState();
  const socket = useSocket();
  function stop(stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
    if (myPeer) {
      myPeer.disconnect();
      console.log({ myPeer });
    }
    setMyStream(null);
    setUserStream(null);
  }

  async function setUpStream(userId) {
    const newPeer = new Peer(id, PEER_SERVER_CONFIG);
    setMyPeer(newPeer);
    // myPeer = newPeer;
    const stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
    setMyStream(stream);
    var call = newPeer.call(userId, stream);
    console.log({ call });
    call.on("stream", (userStream) => {
      setUserStream(userStream);
    });
    // emit event to socket io
    console.log("emmit the vent");
    socket.emit("call-user", { userId });
  }

  function answerCall() {
    const newPeer = new Peer(id, PEER_SERVER_CONFIG);
    // myPeer = newPeer;
    setMyPeer(newPeer);

    newPeer.on("call", async function (call) {
      const stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
      setMyStream(stream);
      call.answer(stream);
      call.on(
        "stream",
        function (remoteStream) {
          console.log({ remoteStream });
          setUserStream(remoteStream);
        },
        function (e) {
          console.log("there was error for the call", e);
        }
      );
    });
  }

  const value = {
    myPeer,
    userStream,
    myStream,
    stop,
    setUpStream,
    setMyStream,
    setUserStream,
    answerCall,
  };
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
