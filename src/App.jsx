import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CustomButton } from './components'
import { SplitView } from './components/SplitView'
import { GanttView } from './components/GanttView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CustomButton onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </CustomButton>

      <hr/>

      <GanttView />
    </>
  )
}

export default App
