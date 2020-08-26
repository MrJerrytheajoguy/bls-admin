import React from "react";
import { Button, Spinner } from "react-bootstrap";
import PropTypes from 'prop-types'

const styles = {
  float: "right"
};
export function SendBtn({children ,loading, onClick, disabled}) {

  
  return loading ? (
    <Button variant="secondary" disabled style={styles}>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Loading...
    </Button>
  ) : (
    <Button variant='success' style={styles} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}
SendBtn.propTypes = {
  loading: PropTypes.bool.isRequired
}