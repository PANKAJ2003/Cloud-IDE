import { useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Landing from './components/Landing.jsx'
import CodingPage from "./components/CodingPage.jsx"
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path='/coding' element={<CodingPage />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
