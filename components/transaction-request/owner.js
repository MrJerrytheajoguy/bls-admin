import React from "react";
import PropTypes from "prop-types";
import { ListGroup } from "react-bootstrap";

const Owner = ({ data }) => {
  return (
    <div>
      <div className="root">
        <ListGroup>
          <ListGroup.Item className="row">
            <div className="wrapper">
              <span className="left">Full Name:</span>
              <span className="right">{data.displayName}</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="row">
            <div className="wrapper">
              <span className="left">Account Number:</span>
              <span className="right">{data.phoneNumber}</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="row">
            <div className="wrapper">
              <span className="left">Primary Address:</span>
              <span className="right">{data.address1}</span>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="row">
            <div className="wrapper">
              <span className="left">City:</span>
              <span className="right">{`${data.city} ${data.state}`}</span>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </div>
      <style jsx>
        {`
          .root {
            padding: 2px 10px;
            background: #66bb6a;
            border-radius: 5px;
          }
          .left {
            font-weight: bold;
          }
          .right {
            float: right;
          }
        `}
      </style>
    </div>
  );
};
Owner.propTypes = {
  data: PropTypes.object,
};
export default Owner;
