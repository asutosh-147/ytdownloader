import { PlaylistInfoType } from "../utils";
import VideoSelect from "./VideoSelect";

type Props = {
  info: PlaylistInfoType;
};

const DownloadPlaylist = ({ info }: Props) => {
  console.log(info);
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
          <div className="font-semibold text-gray-100">
            Total Videos :{" "}
            <span className="font-bold text-white">{info.items.length}</span>
          </div>
        </div>
      </div>
      <VideoSelect links={info.items} />
    </div>
  );
};

export default DownloadPlaylist;
