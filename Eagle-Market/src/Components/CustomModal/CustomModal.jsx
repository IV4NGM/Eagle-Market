import Modal from 'react-bootstrap/Modal'
import './CustomModal.scss'

const nothingFunction = () => {}

// eslint-disable-next-line react/prop-types
const CustomModal = ({ title, showModal, setShowModal, text, onYes = nothingFunction, onNo = nothingFunction, isCancelButton = true, textNo = 'No', textYes = 'Sí', estatico = false }) => {
  return (
    <Modal
      show={showModal} backdrop={estatico ? 'static' : true} keyboard={!estatico} onHide={() => {
        onNo()
        setShowModal(false)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title><h3>{title}</h3></Modal.Title>
      </Modal.Header>
      <Modal.Body><p className='medium-text'>{text}</p></Modal.Body>
      <Modal.Footer>
        {
          isCancelButton
            ? <button
                className='btn btn-outline-secondary btn-modal' onClick={() => {
                  onNo()
                  setShowModal(false)
                }}
              >{textNo}
              </button>
            : ''
        }
        <button
          className='btn btn-outline-success btn-modal' onClick={() => {
            onYes()
            setShowModal(false)
          }}
        >
          {textYes}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default CustomModal
