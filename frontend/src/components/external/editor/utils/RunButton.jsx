import React from 'react'
import { FaCaretRight } from "react-icons/fa";

const RunButton = ({socket,selectedFile}) => {
  

  const runHandler = ()=>{
    const filePath = selectedFile.path;
    socket.emit("runFile",filePath);
  }
  
  
  return (
    <div className='text-[#C2C8CC] flex justify-center items-center relative left-[43%] bg-[#10631e] hover:bg-[#009118]  text-lg p-1.5 px-4 rounded-md'
      onClick={runHandler}
    >
        <span className='text-2xl'><FaCaretRight/></span>
        <div className='font-bold'>Run</div>
    </div>
  )
}

export default RunButton