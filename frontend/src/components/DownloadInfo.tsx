import axios from "axios";
import { useState } from "react";
import { backendUrl, PlaylistInfoType, VideoInfoType } from "../utils";
import Loader from "../ui/Loader";
import DownloadOptions from "./DownloadOptions";
import DownloadPlaylist from "./DownloadPlaylist";
import Progress from "./Progress";
const DownloadInfo = () => {
  const [info, setInfo] = useState<null | VideoInfoType>(null);
  const [playListInfo, setPlayListInfo] = useState<PlaylistInfoType | null>(
    null
  );
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState<null | number>(null);
  const fetchInfo = async () => {
    if (!url.length) return;
    if (url.includes("playlist")) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/playlistInfo?url=${encodeURIComponent(url)}`
        );
        setPlayListInfo(response.data);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/info?url=${url}`);
        const videoData = response.data as VideoInfoType;
        setInfo(videoData);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  const clearInput = () => {
    setUrl("");
    setInfo(null);
    setPlayListInfo(null);
  }
  if (percentage) return <Progress percentage={percentage ? percentage : 100} />;
  if (loading) return <Loader />;
  return (
    <div className="flex justify-center h-full items-center">
      {!info && !playListInfo && (
        <div className="flex justify-center items-center md:flex-row flex-col gap-4 mt-16 w-5/6">
          <input
            type="text"
            placeholder="Paste video/playlist URL here..."
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            className="ring-4 ring-gray-500 p-2 focus:outline-none rounded-md w-full md:w-[500px]"
          />
          <button
            onClick={fetchInfo}
            className="bg-gray-950 p-2 ring-4 ring-gray-800 px-6 rounded-md font-semibold text-gray-200 active:scale-95 transition-transform duration-300 shadow-md"
          >
            Convert
          </button>
        </div>
      )}
      {info && (
        <DownloadOptions
          info={info}
          url={url}
          onClear={clearInput}
          setLoading={setLoading}
          setPercentage={setPercentage}
        />
      )}
      {playListInfo && (
        <DownloadPlaylist
          info={playListInfo}
          setLoading={setLoading}
          setPercentage={setPercentage}
          onClear={clearInput}
        />
      )}
    </div>
  );
};

export default DownloadInfo;
