import React from "react";
import { Modal, Button } from "react-bootstrap";
import Video from "./Video";
import { useCall } from "../context/CallProvider";

export default function CallModal({ open, setOpen }) {
  const { myStream, userStream } = useCall();

  return (
    <Modal size="xl" show={open} onHide={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>Calling someone ...</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column align-items-center">
          <strong style={{ margin: "10px" }}>My Video</strong>
          {myStream && <Video muted={true} stream={myStream} />}
        </div>
        <div className="d-flex flex-column align-items-center">
          <strong style={{ margin: "10px" }}>User Video</strong>
          {userStream && <Video muted={false} stream={userStream} />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
