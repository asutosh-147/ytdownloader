import { Router, Request, Response } from "express";
import ytdl, { videoFormat } from "@distube/ytdl-core";
import { download } from "../utils/downlad";
import ytpl from "ytpl";

export const youtubeRouter = Router();

youtubeRouter.post("/download", (req: Request, res: Response) => {
  try {
    const url = req.body.url as string;
    const format = req.body.format as videoFormat;
    const itags = req.body.itag as number | number[];
    if (!url || !ytdl.validateURL(url))
      return res.status(411).json({ msg: "invalid url" });
    download(res, url, format, itags);
  } catch (error) {
    return res.status(400).json({ msg: "error in managing streams" });
  }
});

youtubeRouter.get("/info", async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const info = await ytdl.getInfo(url);
    const reducedFormats = info.formats
      .filter((metaInfo) => !metaInfo.hasAudio && metaInfo.contentLength && metaInfo.container==="mp4" && metaInfo.qualityLabel)
      .reduce((acc, metaInfo) => {
        const quality = metaInfo.qualityLabel;
        if(!acc[quality]){
          acc[quality] = metaInfo
        }

        return acc;
      }, {} as Record<string,videoFormat>);
      const videoFormats = Object.values(reducedFormats);
    const audioFormats = info.formats.filter((metaInfo) => {
      return (
        metaInfo.hasAudio &&
        !metaInfo.hasVideo &&
        (metaInfo.audioBitrate === 160 || metaInfo.audioBitrate === 128)
      );
    });
    // console.log({
    //   videoFormats,
    // });
    return res.json({
      videoFormats,
      videoDetails: info.videoDetails,
      audioFormats,
    });
  } catch (error: any) {
    return res.status(400).json({ msg: error.message });
  }
});

youtubeRouter.get("/playlistInfo", async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(304).json({ msg: "url not found" });
    const response = await ytpl(url);
    return res.json({ ...response });
  } catch (error) {
    return res.status(400).json({ msg: "error playlist not found" });
  }
});
