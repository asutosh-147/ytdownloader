import ytdl, { videoFormat } from "@distube/ytdl-core";
import cp from "child_process";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { Response } from "express";

ffmpeg.setFfmpegPath(ffmpegPath!);
export async function download(
  res: Response,
  url: string,
  format?: videoFormat,
  itags?: number[] | number
) {
  try {
    if (!format) {
      const info = await ytdl.getInfo(url);
      try {
        format = ytdl.chooseFormat(info.formats, {
          quality: itags,
        });
      } catch (error) {
        format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });
      }
    }
    // console.log(format);
    const videoStream = ytdl(url, {
      format,
    });
    const audioStream = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
    });
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
        "-c:a",
        "aac",
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
    audioStream.pipe(ffmpegProcess.stdio[3] as NodeJS.WritableStream);
    videoStream.pipe(ffmpegProcess.stdio[4] as NodeJS.WritableStream);
    ffmpegProcess.stdio[1].pipe(res);
    ffmpegProcess.on("error", (err: any) => {
      res.status(400).send("Error in processing");
      console.log(err.message);
    });
    ffmpegProcess.on("close", () => {
      console.log("proccessed stream");
    });
  } catch (error:any) {
    console.log(error.message);
  }
}
