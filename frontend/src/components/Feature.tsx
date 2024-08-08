import React from "react";
import Card from "./Card";

const Feature = ({icon,text}:{icon:React.ReactNode,text:string}) => {
  return (
    <Card>
      <div className="flex flex-col w-36 items-center gap-5">
        <div className="text-white text-7xl p-2 font-bold">
          {icon}
        </div>
        <div className="text-white font-semibold text-center text-lg capitalize">
          {text}
        </div>
      </div>
    </Card>
  );
};

export default Feature;
