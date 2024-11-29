import React from "react";
import {
  Button,
  Col,
  Dropdown,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { paymentConstants } from "../../mockDataFolder/MockData";

export default function Contact() {
  var contactForm = {
    name: null,
    mobile: null,
    email: null,
    serviceType: paymentConstants.contactForm.serviceTypes.COMPLAINT,
    serviceOn: paymentConstants.contactForm.serviceOn.CAR,
    body: null,
  };

  // Function to retrieve the contact form data upon submission
  const submitContactsForm = () => {
    return contactForm;
  }

  return (
    <React.Fragment>
      <div className="contact-bg">
        <div className="contact-container">
          <div className="w-100 m-2">
            <h1 className="page-heading">Leave us a message!</h1>

            <div className="contact-form-container">
              <Form
                className="form-bg p-3"
                name="contactForm"
                onSubmit={submitContactsForm()}
              >
                <Row>
                  <Col md={4} sm={4}>
                    <FloatingLabel
                      controlId="name"
                      label="Name*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Name*"
                        className="floating-input"
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={4} sm={4}>
                    <FloatingLabel
                      controlId="mobile"
                      label="Mobile*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        placeholder="Mobile*"
                        className="floating-input"
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={4} sm={4}>
                    <FloatingLabel
                      controlId="email"
                      label="Email*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="email"
                        placeholder="Email*"
                        className="floating-input"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6} lg={6}>
                    <Row>
                      <Col sm={12} lg={12}>
                        <InputGroup className="mb-3 w-100">
                          <InputGroup.Text>Service Type</InputGroup.Text>
                          <Dropdown>
                            <Dropdown.Toggle variant="success">
                              Complaint
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#" value="query">
                                Query
                              </Dropdown.Item>
                              <Dropdown.Item href="#">Complaint</Dropdown.Item>
                              <Dropdown.Item href="#">Request</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </InputGroup>
                      </Col>

                      <Col sm={12} lg={12}>
                        <InputGroup className="mb-3 w-100">
                          <InputGroup.Text id="">Service On</InputGroup.Text>
                          <Dropdown>
                            <Dropdown.Toggle variant="success">
                              Buy Car Insurance
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#" value="query">
                                Buy Car Insurance
                              </Dropdown.Item>
                              <Dropdown.Item href="#">
                                Buy Two-Wheeler Insurance
                              </Dropdown.Item>
                              <Dropdown.Item href="#">
                                Buy Life Insurance
                              </Dropdown.Item>
                              <Dropdown.Item href="#">
                                Buy Health Insurance
                              </Dropdown.Item>
                              <Dropdown.Item href="#">Others</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={6} lg={6}>
                    <Form.Control
                      className="form form-control h-6rem"
                      as="textarea"
                      placeholder="Feedback / Complaint / Query"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} lg={12}>
                    <Button className="w-25" type="submit">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
