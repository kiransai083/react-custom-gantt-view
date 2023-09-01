import React from 'react';
import styled from 'styled-components';
import SampleForm from './SampleForm';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const CloseButton = styled.button`
  background-color: #FFD700;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  color: #333;

  &:hover {
    background-color: #FFA500;
  }
`;

const Popup = ({ type, isOpen, closePopup }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'briefs':
        return <SampleForm />;
      case 'uploads':
        return <p>This is a My Uploads popup!</p>;
      default:
        return <SampleForm />;
    }
  }

  return (
    <PopupOverlay>
      <PopupContainer>
        {/* Popup content */}
        {renderContent()}
        <CloseButton onClick={closePopup}>Close</CloseButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default Popup;
