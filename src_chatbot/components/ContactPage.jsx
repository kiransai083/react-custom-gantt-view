import React from 'react';
import styled from 'styled-components';
import AiDEChat from '../AiDEChat/AiDEChat';

const PageContainer = styled.div`
  padding: 20px;
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const ContactPage = () => {
  return (
    <PageContainer>
      <Heading>Contact Us</Heading>
      <Paragraph>
        Get in touch with us! You can use this page to provide contact
        information and a contact form.
      </Paragraph>
            {/* Rendering BoltChat Window */}
            {/* <AiDEChat type={'contact'} /> */}
    </PageContainer>
  );
};

export default ContactPage;
