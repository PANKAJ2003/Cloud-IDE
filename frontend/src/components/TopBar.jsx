import React, { useState } from 'react'
import RunButton from './external/editor/utils/RunButton';
import HomeButton from './external/editor/components/HomeButton';
import FlowChart from './external/editor/utils/FlowChart';

export const TopBar = ({projectID, socket, selectedFile}) => {

  const [showFlowchart,setShowFlowChart] = useState(false);

  const flowchartButtonHandler = ()=>{
    setShowFlowChart((prev)=> !prev);
  }

  return (
    <div className='bg-[#0E1525] w-full h-14 flex items-center'>
        <HomeButton />
        <div className='text-[#C2C8CC] relative left-20 font-IBMPlexSans text-lg p-2 rounded-md hover:bg-[#1C2333]'>
            {projectID}
        </div>
        <RunButton socket={socket} selectedFile={selectedFile} />
        
        <div className='ml-auto mr-16'>
          <button className='text-[#C2C8CC] relative font-IBMPlexSans text-lg p-2 rounded-md hover:bg-[#1C2333] border-blue-900 border-2'
          onClick={flowchartButtonHandler}
          >
            FlowChart
          </button>
          {showFlowchart && <FlowChart show={flowchartButtonHandler}/>}
        </div>
    </div>
  )
}
