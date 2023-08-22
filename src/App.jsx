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

      <GanttView />
    </>
  )
}

export default App
