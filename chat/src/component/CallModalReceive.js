import React from "react";
import { Modal, Button } from "react-bootstrap";
import Video from "./Video";
import { useCall } from "../context/CallProvider";

export default function CallModalReceive({
  open,
  setOpen,
  handleAccept,
  accept,
  setAccept,
}) {
  const { myStream, userStream } = useCall();

  return (
    <Modal
      size="xl"
      show={open}
      onHide={() => {
        setOpen(false);
        setAccept(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>Receiving the call from ... </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center">
        {accept ? (
          <>
            <div className="d-flex flex-column align-items-center">
              <strong style={{ margin: "10px" }}>My Video</strong>
              {myStream && <Video muted={true} stream={myStream} />}
            </div>
            <div className="d-flex flex-column align-items-center">
              <strong style={{ margin: "10px" }}>User Video</strong>
              {userStream && <Video muted={false} stream={userStream} />}
            </div>
          </>
        ) : (
          <h3>Waiting...</h3>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setOpen(false);
            setAccept(false);
          }}
        >
          Close
        </Button>
        {!accept && (
          <Button onClick={handleAccept}>
            <strong>accept the call</strong>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
