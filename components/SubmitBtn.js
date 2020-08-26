import React from "react";
import { Button, Spinner } from "react-bootstrap";
import PropTypes from 'prop-types'

const styles = {
  float: "right",
  margin: '10px 0'
};
export function SubmitBtn({children ,loading}) {

  
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
    <Button  type='submit' style={styles} variant='outline-success'>
      {children}
    </Button>
  );
}
SubmitBtn.propTypes = {
  loading: PropTypes.bool.isRequired
}