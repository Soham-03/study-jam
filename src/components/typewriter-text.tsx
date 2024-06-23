import React from "react"; 
import Typewriter from 'typewriter-effect'; 
  
export default function TypingEffect() { 
  return ( 
    <div className="flex flex-col"> 
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Creating a Study Plan
      </h2>
      <span className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-2xl pt-4">
        <Typewriter
          options={{
            skipAddStyles: false
          }}

          onInit={(typewriter) => { 
            typewriter.typeString('Tell Something about You..') 
              .callFunction(() => { 
                console.log('String typed out!'); 
              }) 
              .start(); 
          }} 
        /> 
      </span>
    </div> 
  ); 
}