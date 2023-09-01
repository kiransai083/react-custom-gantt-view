import './App.css';
import AiDEChat from './AiDEChat/AiDEChat';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import PagePic from './assets/images/Page2.png';
import { getDOM } from './utils/getDom';

function App() {


  return (
    <div className="App">


      <Box backgroundSize="contain" className='main-container'>
        {/* Modify if needed for the background */}
      </Box>

      {/* Rendering BoltChat Window */}
      <AiDEChat />

    </div>
  );
}

export default App;
