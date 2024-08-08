import ytpl, { Item } from "ytpl";
import Checkbox from "../ui/Checkbox";
type Props = {
  links: Item[];
  setSelectedVideos:React.Dispatch<React.SetStateAction<ytpl.Item[]>>;
  selectedVideos:ytpl.Item[];
};

const VideoSelect = ({ links,selectedVideos,setSelectedVideos }: Props) => {
  return (
    <div className="mt-4 bg-gray-700 rounded-lg">
      <div className="p-2">
        <Checkbox
          label="All"
          id="select-all"
          onChange={(e) => {
            if (e.target.checked) setSelectedVideos(links);
            else setSelectedVideos([]);
          }}
          checked={selectedVideos.length === links.length ? true : false}
        />
      </div>
      {links.map((link) => {
        const isSelected = selectedVideos.find((video) => video.id === link.id)
          ? true
          : false;
        return (
          <nav
            key={link.id}
            className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700"
          >
            <Checkbox
              id={link.id}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedVideos((prev) => [...prev, link]);
                } else {
                  setSelectedVideos(() =>
                    selectedVideos.filter((videos) => videos.id !== link.id)
                  );
                }
              }}
              checked={isSelected}
              label={link.title}
            />
          </nav>
        );
      })}
    </div>
  );
};

export default VideoSelect;
