import React, { useEffect, } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import bike from "../../../../src/images/bike.png";
import ContainerForBike from "../CommonComponents/CountainerForBike"
export default function BikePage() {

  // -----------------------State and var----------------------------

  // ------------------------useEffect-----------------------------
  useEffect(() => {
    // Add the "car-page" class to the body element when the component mounts
    document.body.classList.add("car-page");
    // Clean up function: Remove the "car-page" class when the component unmounts
    return () => {
      document.body.classList.remove("car-page");
    };
  }, []);
  // -------------------------methods and jsx-------------------------------



  return (
    <React.Fragment>
      <Container>
        <Row>
          <h4 className="mb-5 mt-5">Find the best Bike plan</h4>
          <Col sm={12} md={5}>
            <div>
              <img src={bike} alt="" width={"100%"} />
            </div>
          </Col>
          <Col sm={12} md={7} className="mb-3">
            <ContainerForBike />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
