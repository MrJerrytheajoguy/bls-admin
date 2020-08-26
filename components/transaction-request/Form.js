import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form } from "react-bootstrap";
import { SubmitBtn } from "../SubmitBtn";

const schema = yup.object({
  amount: yup
    .number()
    .moreThan(199, "*Minimum of ₦200 is allowed per transaction request")
    .lessThan(
      1000001,
      "*Current maximum saving limit per deposit request is ₦1M"
    )
    .required("*Please, enter the exact amount you wish to save at this time"),
  message: yup.string().min(30, "*Message is too short"),
});


export default ({ owner, postTransaction, loading, type }) => {

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(value) =>
        postTransaction({
          details: { ...value, type },
          owner,
        })
      }
      initialValues={{
        amount: "",
        message: "",
      }}
    >
      {({ getFieldProps, touched, errors, handleSubmit }) => (
        <div style={{padding: '30px 0'}}>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="amount">
              <Form.Control
                type="number"
                name="amount"
                placeholder="Amount"
                {...getFieldProps("amount")}
                isValid={touched.amount && !errors.amount}
                isInvalid={touched.amount && !!errors.amount}
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Control
                type="textarea"
                name="message"
                placeholder="Extra information about this request"
                {...getFieldProps("message")}
                isValid={touched.message && !errors.message}
                isInvalid={touched.message && !!errors.message}
              />
              <Form.Control.Feedback type="invalid">
                {errors.message}
              </Form.Control.Feedback>
            </Form.Group>

            <SubmitBtn loading={loading}>Create transaction</SubmitBtn>
          </Form>
        </div>
      )}
    </Formik>
  );
};
