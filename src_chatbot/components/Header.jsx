import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background-color: #444;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 100%; /* Occupy full width */
  position: fixed; /* Fixed position at the top */
  top: 0;
  z-index: 1000;
`;

const HeaderButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const HeaderIcon = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #FFD700;
  }
`;

const Header = ({ openPopup }) => {


  return (
    <HeaderWrapper>
      <HeaderIcon onClick={() => openPopup('briefs')}>Briefs</HeaderIcon>
        <HeaderIcon onClick={() => openPopup('uploads')}>My Uploads</HeaderIcon>
        <HeaderIcon as="a" href="/home">profile</HeaderIcon>
        <HeaderIcon as="a" href="/about">My Approvals</HeaderIcon>
        <HeaderIcon as="a" href="/contact">Notifications</HeaderIcon>
    </HeaderWrapper>
  );
};

export default Header;
