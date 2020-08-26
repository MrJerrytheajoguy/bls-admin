import React from "react";
import { Alert } from "react-bootstrap";

function alert(header, variant) {
  return ({ alertText, hideAlert }) => {
    if (alertText) {
      return (
        <div className="alert-container">
          <Alert variant={variant} onClose={hideAlert} dismissible>
            <Alert.Heading>{header}</Alert.Heading>
            <p>{alertText}</p>
          </Alert>
          <style jsx>
            {`
              .alert-container {
                margin: 0px 20px;
                z-index: 999;
              }
            `}
          </style>
        </div>
      );
    }
    return null;
  };
}
const SuccessAlert = alert("Success!", "success");
const FailureAlert = alert("Operation Failed!", "danger");

export { SuccessAlert, FailureAlert };
