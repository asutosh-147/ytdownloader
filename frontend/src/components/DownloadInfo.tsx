import axios from "axios";
import { useState } from "react";
import { backendUrl, VideoInfoType } from "../utils";
import { videoFormat } from "ytdl-core";
import Loader from "../ui/Loader";
import Progress from "./Progress";
import { useWindowWidth } from "@react-hook/window-size";
const DownloadInfo = () => {
  const [info, setInfo] = useState<null | VideoInfoType>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formatOption, setFormatOption] = useState<videoFormat | null>(null);
  const [size, setSize] = useState(0);
  const [percentage, setPercentage] = useState<null | number>(null);
  const vw = useWindowWidth();
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
  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/download`,
        {
          format: formatOption,
          url,
        },
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { loaded } = progressEvent;
            // console.log(loaded, size);
            const percentCompleted = Math.ceil((loaded * 100) / size);
            if (percentCompleted > 90) {
              setPercentage(null);
            } else setPercentage(percentCompleted);
          },
        }
      );
      const link = URL.createObjectURL(
        new Blob([response.data], { type: "video/x-matroska" })
      );
      const a = document.createElement("a");
      a.href = link;
      a.download = `${info?.videoDetails.title}.${formatOption?.container}`;
      document.body.appendChild(a);
      a.click();
      a.onload = () => {
        URL.revokeObjectURL(link);
        document.body.removeChild(a);
        setPercentage(100);
      };
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setPercentage(null);
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
        <div className="flex flex-col items-center gap-4 mt-16">
          <div className="flex justify-center gap-5 p-4 m-2 bg-gray-800 bg-opacity-50 rounded-lg md:flex-row flex-col">
            <img
              src={info.videoDetails.thumbnails[3].url}
              alt="Thumbnail"
              className="shadow-xl w-64 sm:w-full mx-auto"
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
                      ? String((Number(info.videoDetails.viewCount) / 1e3).toFixed(2)) + "K"
                      : String((Number(info.videoDetails.viewCount) / 1e6).toFixed(2)) + "M"}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 md:flex-row flex-col">
                <select
                  name="formatType"
                  id="formatType-id"
                  className="text-gray-50 font-semibold rounded-md bg-gray-800 p-1 overflow-y-scroll"
                  onChange={(e) => {
                    const value = JSON.parse(e.target.value) as videoFormat;
                    setFormatOption(value);
                    setSize(
                      Number(value.contentLength) +
                        Number(info.audioFormats[0].contentLength)
                    );
                  }}
                  value={JSON.stringify(formatOption)}
                >
                  {info.videoFormats.map((format, index) => {
                    const maxAudioSize = info.audioFormats[0].contentLength;
                    const size =
                      (Number(format.contentLength) + Number(maxAudioSize)) /
                      (1024 * 1024);
                    return (
                      <option key={index} value={JSON.stringify(format)}>
                        {format.qualityLabel} {format.fps}fps (upto{" "}
                        {size.toFixed(2)}MB) {format.container}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={handleDownload}
                  className="bg-gray-950 p-2 rounded-md font-semibold text-gray-200 active:scale-95 transition-transform duration-300"
                >
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
          {vw > 768 && (
            <div className="invisible md:visible">
              <iframe
                src={info.videoDetails.embed.iframeUrl}
                width={854}
                height={480}
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadInfo;
