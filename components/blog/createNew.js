import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button } from "react-bootstrap";
import { SubmitBtn } from "../SubmitBtn";
import ReactMde from "react-mde";
import Showdown from "showdown";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const schema = yup.object({
  title: yup.string().min(10, "* title is too short").required(),
  author: yup.string().min(10).required(),
  category: yup.string().required(),
  body: yup
    .string()
    .min(100, "* article is too short")
    .required("* body of the article is required"),
});

export const CreatePost = ({ createPost, loading, post, id }) => {
  const [selectedTab, setSelectedTab] = useState(
    "write" | ("preview" > "write")
  );

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => createPost(values, id)}
      initialValues={{
        body: (post && post.body) || "",
        title: (post && post.title) || "",
        category: (post && post.category) || "",
        author: (post && post.author) || "",
      }}
    >
      {({
        getFieldProps,
        touched,
        errors,
        handleSubmit,
        values,
        setFieldValue,
      }) => (
        <div>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Control
                type="text"
                name="title"
                placeholder="Article Ttitle"
                {...getFieldProps("title")}
                isValid={touched.title && !errors.title}
                isInvalid={touched.title && !!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="author">
              <Form.Control
                type="text"
                name="author"
                placeholder="Name of author"
                {...getFieldProps("author")}
                isValid={touched.author && !errors.author}
                isInvalid={touched.author && !!errors.author}
              />
              <Form.Control.Feedback type="invalid">
                {errors.author}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label srOnly>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                selected="religion"
                {...getFieldProps("category")}
                isValid={touched.category && !errors.category}
                isInvalid={touched.category && !!errors.category}
              >
                <option value="finance" defaultValue>
                  select category
                </option>
                <option value="finance">Finance</option>
                <option value="politics">Politics</option>
                <option value="religion">Religion</option>
                <option value="education">Education</option>
                <option value="sports">Sports</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="md-container">
              <ReactMde
                value={values.body}
                onChange={(e) => setFieldValue("body", e)}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
              {touched && errors.body ? (
                <div style={{ color: "#d32f2f", fontSize: 13 }}>
                  {errors.body}
                </div>
              ) : null}
            </div>
            <SubmitBtn loading={loading}>{post ? "update" : "post"}</SubmitBtn>
          </Form>
        </div>
      )}
    </Formik>
  );
};
