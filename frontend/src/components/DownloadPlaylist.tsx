import { useState } from "react";
import { backendUrl, PlaylistInfoType } from "../utils";
import { Button } from "./ui/button";
import VideoSelect from "./VideoSelect";
import axios from "axios";
type Props = {
  info: PlaylistInfoType;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPercentage: React.Dispatch<React.SetStateAction<number | null>>;
  onClear: () => void;
};
type QualitiesType = "1080" | "720" | "480" | "360";
const itags = new Map<string, number[]>([
  ["1080", [248, 137]],
  ["720", [247, 136]],
  ["480", [135]],
  ["360", [134, 18]],
]);
const DownloadPlaylist = ({ info, setLoading, onClear }: Props) => {
  const [selectedVideos, setSelectedVideos] = useState(info.items);
  const [quality, setQuality] = useState<QualitiesType>("1080");
  const handleDownload = async (title: string, url: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/download`,
        {
          url,
          itag:itags.get(quality)
        },
        {
          responseType: "blob",
        }
      );
      const link = URL.createObjectURL(
        new Blob([response.data], { type: "video/x-matroska" })
      );
      const a = document.createElement("a");
      a.href = link;
      a.download = `${title}.mkv`;
      document.body.appendChild(a);
      a.click();
      a.onload = () => {
        URL.revokeObjectURL(link);
        document.body.removeChild(a);
      };
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadPlaylist = () => {
    selectedVideos.forEach(async (video) => {
      await handleDownload(video.title, video.url);
    });
  };
  return (
    <div className="p-2">
      <div className="flex md:flex-row flex-col items-center md:justify-between bg-gray-700 p-4 rounded-lg gap-4 text-white">
        <img src={info.bestThumbnail.url!} alt="Thumbnail" className="w-96" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-bold">
            {info.title}
            <div className="text-xs font-medium text-gray-200">
              {info.lastUpdated}
            </div>
          </div>
          <div className="font-bold flex gap-2 items-center">
            <img
              src={info.author.bestAvatar.url!}
              alt="channel Thumbnail"
              className="w-7 rounded-full"
            />
            <div>{info.author.name}</div>
          </div>
          <div className="font-semibold text-gray-100">
            Total Views :{" "}
            <span className="font-bold text-white">
              {info.views >= 1e6
                ? (info.views / 1e6).toFixed(2).toString() + "M"
                : (info.views / 1e3).toFixed(3).toString() + "K"}
            </span>
          </div>
          <div className="font-semibold text-gray-100 flex justify-between items-center gap-5">
            <div>
              Total Videos :{" "}
              <span className="font-bold text-white">{info.items.length}</span>
            </div>
            <div>
              <select
                name="qualityType"
                id="qualityType-id"
                className="text-gray-50 font-semibold rounded-md bg-gray-800 p-1 px-3 overflow-y-scroll"
                onChange={(e) => {
                  setQuality(e.target.value as QualitiesType);
                }}
                value={quality}
              >
                {Array.from(itags.keys()).map((itag) => {
                  return <option value={itag} className="hover:bg-gray-500">{itag}p</option>;
                })}
              </select>
            </div>
            <div className="flex gap-5 items-center">
              <Button onClick={handleDownloadPlaylist}>Download</Button>
              <Button className="bg-red-500 px-6" onClick={onClear}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <VideoSelect
        links={info.items}
        setSelectedVideos={setSelectedVideos}
        selectedVideos={selectedVideos}
      />
    </div>
  );
};

export default DownloadPlaylist;
