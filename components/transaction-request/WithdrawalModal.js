import React from "react";
import { Modal } from "react-bootstrap";
import Owner from "./owner";
import Form from "./Form";

export default ({
  user,
  withdrawalOpen,
  hideWithdrawal,
  postTransaction,
  transLoading,
}) => {
  const handleClose = () => hideWithdrawal();
  const styles = {
    header: {
      background: "#2e7d32 !important",
      letterSpacing: "2px",
    },
  };

  return (
    <Modal centered show={withdrawalOpen} onHide={handleClose}>
      <Modal.Header className="header" closeButton style={styles.header}>
        <p>
          Withdrawal initiated by the admin will automatically assume the
          approved status
        </p>
      </Modal.Header>
      <Modal.Body>
        <Owner data={user} />
        <Form
          owner={user}
          postTransaction={postTransaction}
          loading={transLoading}
          type="withdrawal"
        />
      </Modal.Body>
    </Modal>
  );
};
