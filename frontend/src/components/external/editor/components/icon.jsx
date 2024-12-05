import React, {ReactNode} from 'react'
import {SiHtml5, SiCss3, SiJavascript, SiTypescript, SiJson} from "react-icons/si";
import { FaFolder ,FaFolderOpen,FaFile,FaJava,FaFileCode} from "react-icons/fa";
import {AiFillFileText,AiFillPicture } from "react-icons/ai";

function getIconHelper() {
  const cache = new Map();
  cache.set("js", <SiJavascript color="#fbcb38"/>);
  cache.set("jsx", <SiJavascript color="#fbcb38"/>);
  cache.set("ts", <SiTypescript color="#378baa"/>);
  cache.set("tsx", <SiTypescript color="#378baa"/>);
  cache.set("css", <SiCss3 color="purple"/>);
  cache.set("json", <SiJson color="#5656e6"/>);
  cache.set("html", <SiHtml5 color="#e04e2c"/>);
  cache.set("png", <AiFillPicture/>);
  cache.set("jpg", <AiFillPicture/>);
  cache.set("ico", <AiFillPicture/>);
  cache.set("java", <FaJava color='orange' />)
  cache.set("class", <FaFileCode color='red' />)
  cache.set("txt", <AiFillFileText color="white"/>);
  cache.set("closedDirectory", <FaFolder/>);
  cache.set("openDirectory", <FaFolderOpen/>);
  return function (extension, name){
    if (cache.has(extension))
      return cache.get(extension);
    else if (cache.has(name))
      return cache.get(name);
    else
      return <FaFile/>;
  }
}

export const getIcon = getIconHelper();