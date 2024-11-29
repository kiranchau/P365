import Modal from 'react-bootstrap/Modal';
import NotFound from "../../../images/not-found.png";
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

export function VehicalNotFoundModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="kyc-modal success-modal"
        >
            <div className="check-icon-wrap">
                <img src={NotFound} alt="" style={{ width: "140px" }} />
            </div>
            <h4 className="text-center mt-3 mb-4">Vehical Not Found</h4>
            <Modal.Body className="p-0">
            </Modal.Body>
            <Modal.Footer className="modalfooter">
                <Button className="primary-btn" onClick={props.onHide}>
                    Back
                </Button>

            </Modal.Footer>
        </Modal>
    );
}

export function CarPolicy(props) {
    const history = useHistory();

    const handlePurchaseClick = () => {
        // Redirect to the desired route based on the policy type
        const policyType = props.type === 1 ? "Bike" : "Car";
        history.push({
          pathname: `/${policyType?.toLowerCase()}`,
        });
    
        // Close the modal after redirecting
        props.onHide();
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="kyc-modal success-modal"
        >
            <div className="close-icon-wrap">
            </div>
            <div className="check-icon-wrap">
                <img src={NotFound} alt="" style={{ width: "140px" }} />
            </div>
            <Modal.Body className="p-0">
                <p className="text-center mt-0 sub-heading">
                    {props.message}
                </p>
                <p className="text-center sub-text ">Please check the registration no or click on {`${props.type===1?"Bike":"Car"}`} option to purchase {`${props.type===1?"Bike":"Car"}`} policy”</p>
            </Modal.Body>
            <Modal.Footer className="modalfooter">
                <Button className="back-btn" onClick={()=>{props.onHide();props.formik.resetForm()}}>
                    Cancel
                </Button>
                <Button className="primary-btn" style={{ width: 'auto' }} onClick={handlePurchaseClick}>
                    Purchase {`${props.type===1?"Bike":"Car"}`} Policy
                </Button>

            </Modal.Footer>
        </Modal>
    );
}