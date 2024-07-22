import ytdl, { videoFormat } from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import cp from "child_process";
import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import HttpsProxyAgent from "https-proxy-agent";

const proxy = "http://111.111.111.111:8080";
const agent = HttpsProxyAgent(proxy);

ffmpeg.setFfmpegPath(ffmpegPath!);

const app = express();
app.use(cors());
app.use(express.json());
async function download(res: Response, url: string, format: videoFormat) {
  const videoStream = ytdl(url, {
    format,
  });
  videoStream.pipe(fs.createWriteStream("ouput.mp4"));
  // const audioStream = ytdl(url, {
  //   quality: "highestaudio",
  //   filter: "audioonly",
  // });
  // const ffmpegProcess = cp.spawn(
  //   ffmpegPath!,
  //   [
  //     "-loglevel", "8",
  //     "-hide_banner",
  //     "-i", "pipe:3",
  //     "-i", "pipe:4",
  //     "-map", "0:v", // video from first input
  //     "-map", "1:a", // audio from second input
  //     "-c:v", "copy",
  //     "-c:a", "aac", // ensure compatibility
  //     "-f", "matroska", // matroska format (mkv)
  //     "pipe:1",
  //   ],
  //   {
  //     windowsHide: true,
  //     stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
  //   }
  // );

  // res.setHeader("Content-Type", "video/x-matroska");
  // res.setHeader("Content-Disposition", "attachment;filename=video.mkv");

  // audioStream.pipe(ffmpegProcess.stdio[3] as NodeJS.WritableStream);
  // videoStream.pipe(ffmpegProcess.stdio[4] as NodeJS.WritableStream);
  // // ffmpegProcess.stdio[1]?.pipe(fs.createWriteStream('output.mp4'));
  // ffmpegProcess.on("error", (err: any) => {
  //   res.status(400).send("Error in processing");
  //   console.log(err.message);
  // });
  // ffmpegProcess.on("close", () => {
  //   console.log("proccessed stream");
  // });
}

app.post("/download", (req: Request, res: Response) => {
  try {
    const url = req.body.url as string;
    const format = req.body.format as videoFormat;
    if (!url || !format) return res.status(411).json({ msg: "invalid input" });
    download(res, url, format);
  } catch (error) {
    return res.status(400).json({ msg: "error in managing streams" });
  }
});
app.get("/info", async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const info = await ytdl.getInfo(url);
    const videoFormats = info.formats.filter((metaInfo) => {
      if (!metaInfo.qualityLabel) return false;
      const lessThanFHD = parseInt(metaInfo.qualityLabel.split("p")[0]) <= 1080;
      return (
        ((lessThanFHD && metaInfo.container === "mp4") || !lessThanFHD) &&
        !metaInfo.hasAudio
      );
    });

    res.json({ videoFormats, videoDetails: info.videoDetails });
  } catch (error: any) {
    return res.status(400).json({ msg: error.message });
  }
});
app.listen(3000, () => {
  console.log("listening port 3000");
});

async function downloadVideo() {
  const url = "https://youtu.be/4FXx942BEms?si=wQC2XNIbM7PNRTPL";

  try {
    const videoStream = ytdl(url, {
      requestOptions: { agent },
    });

    videoStream
      .pipe(fs.createWriteStream("video.mp4"))
      .on("finish", () => {
        console.log("Download complete");
      })
      .on("error", (error) => {
        console.error("Error writing to file:", error);
      });

    videoStream.on("error", (error) => {
      console.error("Error downloading video:", error);
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

downloadVideo();
