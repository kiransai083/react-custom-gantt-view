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

const HomePage = () => {
  console.log('home page rendered::::');
  return (
    <PageContainer>
      <Heading>Welcome to the Home Page</Heading>
      <Paragraph>
        This is the content of the home page. You can add more paragraphs and
        content here.
      </Paragraph>
            {/* Rendering BoltChat Window */}
            {/* <AiDEChat type={'home'} /> */}
    </PageContainer>
  );
};

export default HomePage;
