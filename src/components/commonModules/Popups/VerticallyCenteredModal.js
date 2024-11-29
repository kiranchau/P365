import close from "../../../images/close.svg";
import { Modal } from "react-bootstrap";
import SVG from "react-inlinesvg";


function VerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="IDV-modal"
    >
      <div className="d-flex justify-content-between header-wrap pb-0">
        <h4 className="modal-heading ">{props.heading}</h4>
        {!props?.hideCloseIcon && <SVG
          src={close}
          alt=""
          width={"25px"}
          className="close-icon"
          onClick={props.onHide}
        />}

      </div>
      <Modal.Body>
        {props.children}
      </Modal.Body>
    </Modal>
  );
}

export default VerticallyCenteredModal