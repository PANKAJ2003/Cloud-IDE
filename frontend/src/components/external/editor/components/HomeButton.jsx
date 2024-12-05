import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const HomeButton = () => {
    const navigate = useNavigate();
    const onClickHandler = ()=>{
        navigate('/')
    }
  return (
    <div className="h-14 flex items-center">
      <span className="text-[#C2C8CC] relative left-16 text-lg hover:bg-[#1C2333] p-2 rounded-md"
      onClick={onClickHandler}>
        <IoHomeOutline />
      </span>
    </div>
  );
};

export default HomeButton;
