import React, { useState } from 'react';
import Modal from 'react-modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Bạn có chắc chắn muốn chia sẻ không?</h2>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onClose}>No</button>
    </Modal>
  );
};

export default ConfirmModal;