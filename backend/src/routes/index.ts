import { Router, Request, Response } from "express";
import ytdl, { videoFormat } from "@distube/ytdl-core";
import { download } from "../utils/downlad";
import ytpl from "ytpl";


export const youtubeRouter = Router();

youtubeRouter.post("/download", (req: Request, res: Response) => {
  try {
    const url = req.body.url as string;
    const format = req.body.format as videoFormat;
    if (!url || !format) return res.status(411).json({ msg: "invalid input" });
    download(res, url, format);
  } catch (error) {
    return res.status(400).json({ msg: "error in managing streams" });
  }
});

youtubeRouter.get("/info", async (req: Request, res: Response) => {
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
    const audioFormats = info.formats.filter((metaInfo) => {
      return (
        metaInfo.hasAudio &&
        !metaInfo.hasVideo &&
        (metaInfo.audioBitrate === 160 || metaInfo.audioBitrate === 128)
      );
    });
    res.json({ videoFormats, videoDetails: info.videoDetails, audioFormats });
  } catch (error: any) {
    return res.status(400).json({ msg: error.message });
  }
});

youtubeRouter.get("/playlistInfo",async (req: Request, res: Response) => {
    try {
        const url = req.query.url as string;
        if(!url) return res.status(304).json({msg:"url not found"});
        const response = await ytpl(url);
        return res.json({...response});
    } catch (error) {
        return res.status(400).json({msg:"error playlist not found"});
    }
});
