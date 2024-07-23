import axios from "axios";
import { useState } from "react";
import { backendUrl, VideoInfoType } from "../utils";
import { videoFormat } from "ytdl-core";
import Loader from "../ui/Loader";

const DownloadInfo = () => {
  const [info, setInfo] = useState<null | VideoInfoType>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formatOption, setFormatOption] = useState<videoFormat | null>(null);
  const fetchInfo = async () => {
    if(!url.length) return;
    setLoading(true);
    const response = await axios.get(`${backendUrl}/info?url=${url}`);
    const videoData = response.data;
    setInfo(videoData);
    setFormatOption(videoData.videoFormats[0]!);
    setLoading(false);
  };
  const handleDownload = async () =>{
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/download`,{
        format:formatOption,
        url
      },{
        responseType:'blob'
      });
      const link = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = link;
      a.download = `${info?.videoDetails.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(link);
      document.body.removeChild(a);
    } catch (error: any) {
      console.log(error.message);
    } finally{
      setLoading(false);
    }
  }
  return (
    <div className="flex justify-center h-full items-center">
      {!info && !loading && (
        <div className="space-x-4 mt-16">
          <input
            type="text"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            className="ring-2 ring-black p-2 focus:outline-none rounded-md w-[600px]"
          />
          <button
            onClick={fetchInfo}
            className="bg-gray-950 p-2 rounded-md font-semibold text-gray-200 active:scale-95 transition-transform duration-300"
          >
            get Info
          </button>
        </div>
      )}
      {
        loading && <Loader/>
      }
      {info && !loading && (
        <div className="flex flex-col items-center gap-4 mt-16">
          <div className="flex justify-center gap-5 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
            <img
              src={info.videoDetails.thumbnails[3].url}
              alt="Thumbnail"
              className="shadow-xl"
            />
            <div className="flex flex-col text-white gap-2">
              <div className="text-lg font-semibold text-white text-wrap">
                {info.videoDetails.title}
              </div>
              <div className="font-semibold">
                {info.videoDetails.author.user}
              </div>
              <div className="flex gap-2">
                <div>
                  <span className="text-gray-200">duration: </span>{" "}
                  <span className="font-medium">
                    {Math.floor(Number(info.videoDetails.lengthSeconds) / 60)}:
                    {Number(info.videoDetails.lengthSeconds) % 60}{" "}
                  </span>
                </div>
                <div className="text-gray-200">
                  views:{" "}
                  <span className="font-semibold text-white">
                    {Number(info.videoDetails.viewCount) < 1e6
                      ? String(Number(info.videoDetails.viewCount) / 1e3) + "K"
                      : String(Number(info.videoDetails.viewCount) / 1e6) + "M"}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  name="formatType"
                  id="formatType-id"
                  className="text-gray-50 font-semibold rounded-md bg-gray-800 p-1"
                  onChange={(e) => {
                    setFormatOption(JSON.parse(e.target.value));
                  }}
                  value={JSON.stringify(formatOption)}
                >
                  {info.videoFormats.map((format, index) => {
                    const maxAudioSize = info.audioFormats[0].contentLength;
                    const size = (Number(format.contentLength) + Number(maxAudioSize)) / (1024 * 1024);
                    return (
                      <option key={index} value={JSON.stringify(format)}>
                        {format.qualityLabel} (upto {size.toFixed(2)}MB){" "}
                        {format.container}
                      </option>
                    );
                  })}
                </select>
                <button onClick={handleDownload} className="bg-gray-950 p-2 rounded-md font-semibold text-gray-200 active:scale-95 transition-transform duration-300">
                  Download
                </button>
                <button
                  onClick={() => {
                    setInfo(null);
                    setUrl("");
                  }}
                  className="bg-red-500 p-2 px-6 rounded-md font-semibold text-gray-200 active:scale-95 transition-transform duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div>
            <iframe
              src={info.videoDetails.embed.iframeUrl}
              width={854}
              height={480}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadInfo;
