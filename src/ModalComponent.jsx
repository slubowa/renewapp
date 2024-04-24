import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Popup(props) {
  const handleClose = () => props.handleClose();


  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.popupMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {props.buttonContent}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Popup;
