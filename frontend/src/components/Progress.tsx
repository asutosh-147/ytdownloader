import { CircularProgressbar } from "react-circular-progressbar";
const Progress = ({ percentage }: { percentage: number }) => {
  return (
    <div className="size-32 md:size-48 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="pb-5 font-semibold text-white text-lg md:text-2xl">Downloading👇</div>
      <CircularProgressbar value={percentage} text={`${percentage}%`} />
    </div>
  );
};

export default Progress;
