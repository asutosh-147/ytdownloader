import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import cp from "child_process";
import express, { Request, Response } from "express";
import cors from "cors";
ffmpeg.setFfmpegPath(ffmpegPath!);
const app = express();
app.use(cors());
async function download(res: Response, url: string) {
  const videoStream = ytdl(url, {
    quality: "highestvideo",
    filter: "videoonly",
  });
  const audioStream = ytdl(url, {
    quality: "highestaudio",
    filter: "audioonly",
  });
  const length = 11917903; //TODO: algoritm to get the size of combined video
  // 11364315
  // 127137
  const ffmpegProcess = cp.spawn(
    ffmpegPath!,
    [
      "-loglevel",
      "8",
      "-hide_banner",
      "-i",
      "pipe:3",
      "-i",
      "pipe:4",
      "-map",
      "0:a",
      "-map",
      "1:v",
      "-c:v",
      "copy",
      "-f",
      "matroska",
      "pipe:1",
    ],
    {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
    }
  );

  res.setHeader("Content-Type", "video/x-matroska");
  res.setHeader("Content-Disposition", "attachment;filename=video.mp4");
  res.setHeader("Content-Length", length.toString());

  audioStream.pipe(ffmpegProcess.stdio[3] as NodeJS.WritableStream);
  videoStream.pipe(ffmpegProcess.stdio[4] as NodeJS.WritableStream);
  // ffmpegProcess.stdio[1]?.pipe(res);
  ffmpegProcess.on("error", (err: any) => {
    res.status(400).send("Error in processing");
    console.log(err.message);
  });
  ffmpegProcess.on("close", () => {
    console.log("proccessed stream");
  });
}

app.get("/download", (req: Request, res: Response) => {
  const url = req.query.url as string;
  download(res, url);
});
app.listen(3000, () => {
  console.log("listening port 3000");
});

// ytdl
//   .getInfo("https://www.youtube.com/watch?v=f4AocpJDfsM")
//   .then((info) => ytdl.chooseFormat(info.formats,{quality:"highestaudio"}))
//   .then((data)=> console.log(data))
ytdl
  .getInfo("https://www.youtube.com/watch?v=f4AocpJDfsM")
  .then((info) => console.log(info.formats))
