import Modal from 'react-bootstrap/Modal'

const nothingFunction = () => {}

// eslint-disable-next-line react/prop-types
const CustomModal = ({ title, showModal, setShowModal, text, onYes = nothingFunction, onNo = nothingFunction, isCancelButton = true, textNo = 'No', textYes = 'Yes', estatico = false }) => {
  return (
    <Modal
      show={showModal} backdrop={estatico ? 'static' : true} keyboard={!estatico} onHide={() => {
        onNo()
        setShowModal(false)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        {
          isCancelButton
            ? <button onClick={() => {
              onNo()
              setShowModal(false)
            }}>{textNo}
            </button>
            : ''
        }
        <button onClick={() => {
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
