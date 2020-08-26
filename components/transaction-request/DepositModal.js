import React from "react";
import { Modal } from "react-bootstrap";
import Owner from "./owner";
import Form from "./Form";

export default ({
  user,
  depositOpen,
  hideDeposit,
  postTransaction,
  transLoading,
}) => {
  const handleClose = () => hideDeposit();

  const styles = {
    header: {
      background: "#2e7d32 !important",
      letterSpacing: "2px",
    },
  };
  return (
    <Modal centered show={depositOpen} onHide={handleClose}>
      <Modal.Header style={styles.header} closeButton>
        <p>
          A deposit request initiated by the admin will
          <br />
          automatically assume the status of approved
        </p>
      </Modal.Header>
      <Modal.Body>
        <Owner data={user} />
        <Form
          owner={user}
          postTransaction={postTransaction}
          loading={transLoading}
          type="deposit"
        />
      </Modal.Body>
    </Modal>
  );
};
