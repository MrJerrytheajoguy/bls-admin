import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form } from "react-bootstrap";
import { SubmitBtn } from "../SubmitBtn";

const schema = yup.object({
  body: yup.string().min(30, "*Message is too short").required(),
});

export default ({ details, postReply, loading }) => {
    
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) =>{
          const newReply = {
            date: new Date().toISOString(),
            body: values.body,
            replier: 'Admin'
          }
        postReply({
            replies: [...details.replies, newReply],
            details,
          })
      }
       
      }
      initialValues={{
        body: "",
      }}
    >
      {({ getFieldProps, touched, errors, handleSubmit }) => (
        <div style={{ padding: "30px 0" }}>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="body">
              <Form.Control
                type="textarea"
                name="body"
                placeholder="Your reply"
                {...getFieldProps("body")}
                isValid={touched.body && !errors.body}
                isInvalid={touched.body && !!errors.body}
              />
              <Form.Control.Feedback type="invalid">
                {errors.body}
              </Form.Control.Feedback>
            </Form.Group>

            <SubmitBtn loading={loading}>send</SubmitBtn>
          </Form>
        </div>
      )}
    </Formik>
  );
};
