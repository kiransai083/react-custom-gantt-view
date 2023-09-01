import React from 'react';
import styled from 'styled-components';
import AiDEChat from '../AiDEChat/AiDEChat';
import TableComponent from './Table';

const PageContainer = styled.div`
  padding: 20px;
  flex: 0.5;
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const AboutPage = ({prompt}) => {
console.log("🚀 ~ file: AboutPage.jsx:22 ~ AboutPage ~ prompt:", prompt)

  const sampleData = [
    { name: 'John', age: 25, country: 'USA' },
    { name: 'Alice', age: 30, country: 'Canada' },
    { name: 'Bob', age: 22, country: 'UK' }
  ];

  return (
    <PageContainer>
      <Heading>About Us</Heading>
      <TableComponent searchKey={prompt?.text || ''} data={sampleData} />
            {/* Rendering BoltChat Window */}
            {/* <AiDEChat type={'approvals'} /> */}
    </PageContainer>
  );
};

export default AboutPage;
