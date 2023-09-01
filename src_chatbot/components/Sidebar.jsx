import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 20%;
  background-color: #333;
  color: white;
  padding: 20px;
  height: 100vh; /* Occupy full height */
  position: fixed; /* Fixed position on the left */
  top: 0;
  left: 0;
  z-index: 999; /* Ensure it's behind the header */
`;

const SidebarHeading = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
`;

const SidebarLink = styled.a`
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarHeading>Navigation</SidebarHeading>
      <SidebarLink href="/home">Home</SidebarLink>
      <SidebarLink href="/about">About</SidebarLink>
      <SidebarLink href="/contact">Contact</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
