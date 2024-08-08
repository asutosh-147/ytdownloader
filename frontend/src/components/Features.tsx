import { IoMdSpeedometer } from "react-icons/io";
import Feature from "./Feature";
import { CgPlayListCheck } from "react-icons/cg";
import { AiOutlineSafety } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";

const Features = () => {
  return (
    <div className="flex flex-col mt-20 gap-16">
        <div className="flex justify-center">
          <Link to={'/download'} className="text-xl flex items-center gap-5 bg-red-500 font-bold text-white p-4 rounded-lg shadow-2xl active:scale-95 transition-all duration-300">
            {<FaYoutube className="text-4xl" />} Click Here To Start
          </Link>
        </div>
        <div className="flex justify-center gap-20 flex-wrap">
            <Feature icon={"4k"} text="download Upto 4k resolution" />
            <Feature icon={<IoMdSpeedometer />} text="High Speed Downloads with No limits" />
            <Feature icon={<CgPlayListCheck />} text="Video as well as playlist support" />
            <Feature icon={ <AiOutlineSafety />} text="100% safe and secure" />
        </div>
    </div>
  );
};

export default Features;
