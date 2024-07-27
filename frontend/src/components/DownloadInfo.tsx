import axios from "axios";
import { useState } from "react";
import { backendUrl, PlaylistInfoType, VideoInfoType } from "../utils";
import Loader from "../ui/Loader";
import DownloadOptions from "./DownloadOptions";
import DownloadPlaylist from "./DownloadPlaylist";
const DownloadInfo = () => {
  const [info, setInfo] = useState<null | VideoInfoType>(null);
  const [playListInfo, setPlayListInfo] = useState<PlaylistInfoType | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchInfo = async () => {
    if (!url.length) return;
    if(url.includes("playlist")){
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/playlistInfo?url=${encodeURIComponent(url)}`);
        setPlayListInfo(response.data);
      } catch (error:any) {
        console.log(error.message);
      } finally{
        setLoading(false);
      }
    }else{
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
  if (loading) return <Loader />;

  return (
    <div className="flex justify-center h-full items-center">
      {!info && !playListInfo && (
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
      {info && (
        <DownloadOptions
          info={info}
          setInfo={setInfo}
          url={url}
          setUrl={setUrl}
          setLoading={setLoading}
        />
      )}
      {
        playListInfo && <DownloadPlaylist info={playListInfo} />
      }
    </div>
  );
};

export default DownloadInfo;
