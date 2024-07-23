export const backendUrl = import.meta.env.VITE_BACKEND_URL;
import {MoreVideoDetails, videoFormat} from "ytdl-core"
export type VideoInfoType = {
    videoFormats:videoFormat[],
    videoDetails:MoreVideoDetails,
    audioFormats:videoFormat[],
}