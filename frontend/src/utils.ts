export const backendUrl = import.meta.env.VITE_BACKEND_URL;
import {MoreVideoDetails, videoFormat} from "ytdl-core"
import { Result } from "ytpl"
export type VideoInfoType = {
    videoFormats:videoFormat[],
    videoDetails:MoreVideoDetails,
    audioFormats:videoFormat[],
}
export type PlaylistInfoType = Result;