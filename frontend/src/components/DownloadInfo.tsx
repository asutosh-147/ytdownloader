import axios from "axios";
import { useState } from "react";
import { backendUrl, VideoInfoType } from "../utils";
import { videoFormat } from "ytdl-core";
import Loader from "../ui/Loader";
import Progress from "./Progress";
import DownloadOptions from "./DownloadOptions";
const DownloadInfo = () => {
  const [info, setInfo] = useState<null | VideoInfoType>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formatOption, setFormatOption] = useState<videoFormat | null>(null);
  const [size, setSize] = useState(0);
  const [percentage, setPercentage] = useState<null | number>(null);
  const fetchInfo = async () => {
    if (!url.length) return;
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/info?url=${url}`);
      const videoData = response.data as VideoInfoType;
      setInfo(videoData);
      setFormatOption(videoData.videoFormats[0]);
      setSize(
        Number(videoData.videoFormats[0].contentLength) +
          Number(videoData.audioFormats[0].contentLength)
      );
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center h-full items-center">
      {!info && !loading && (
        <div className="flex justify-center items-center md:flex-row flex-col gap-4 mt-16 w-5/6">
          <input
            type="text"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            className="ring-4 ring-gray-500 p-2 focus:outline-none rounded-md w-full md:w-[500px]"
          />
          <button
            onClick={fetchInfo}
            className="bg-gray-950 p-2 px-6 rounded-md font-semibold text-gray-200 active:scale-95 transition-transform duration-300"
          >
            Get Video
          </button>
        </div>
      )}
      {loading && !percentage && <Loader />}
      {percentage && <Progress percentage={percentage ? percentage : 100} />}
      {info && !loading && (
        <DownloadOptions
          formatOption={formatOption}
          info={info}
          setFormatOption={setFormatOption}
          setInfo={setInfo}
          setLoading={setLoading}
          setPercentage={setPercentage}
          setSize={setSize}
          setUrl={setUrl}
          size={size}
          url={url}
        />
      )}
    </div>
  );
};

export default DownloadInfo;
