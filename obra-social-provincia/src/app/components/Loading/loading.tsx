import React from 'react';
import './loading.css'; 
import Logo from "../../../../public/Logo.png"
import Image from 'next/image';

const Loading = () => {
  return (
    <div className="load">
      <div className="load-bar"></div>
      <Image 
        src={Logo} 
        alt="Loading"
        className="load-img" 
        width={50}  
        height={50}
      />
    <div className="waviy">
   <span >c</span>
   <span>a</span>
   <span>r</span>
   <span>g</span>
   <span>a</span>
   <span>n</span>
   <span>d</span>
   <span>o</span>
   <span>.</span>
   <span>.</span>
   <span>.</span>
   
  </div>
    </div>
    
  );
};

export default Loading;
