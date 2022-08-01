import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import UploadFile from "./components/Uploadfile"

function App() {
  
  return (
      <BrowserRouter>
        {/* <Link to="/home">Home Page </Link>
      <Link to="/login">Login Page</Link>    */}
        <Navbar/>
        <Routes>
          <Route element={<UploadFile />} path="/" />
          <Route element={<UploadFile />} path="uploadfile" />
          {/* <Route element={<Chatbox></Chatbox>}path="chatbox"/> */}

          <Route element={<Navigate to="/home" />} path="/" />
        </Routes>
      </BrowserRouter>
  )
}

export default App
