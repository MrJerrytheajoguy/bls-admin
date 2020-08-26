import React from "react";
import { Alert } from "react-bootstrap";
function AlertBox({ alertText, hideAlert }) {

  if (alertText) {
    return (
      <div className="alert-container">
        <Alert variant='success' onClose={hideAlert} dismissible>
          <Alert.Heading>Success!</Alert.Heading>
          <p>{alertText}</p>
        </Alert>
        <style jsx>
          {`
            .alert-container {
              margin: 40px 20px;
            }
          `}
        </style>
      </div>
    );
  }
  return null;
}
export default AlertBox;
