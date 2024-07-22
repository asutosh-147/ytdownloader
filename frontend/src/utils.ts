export const backendUrl = "http://localhost:3000";
import {MoreVideoDetails, videoFormat} from "ytdl-core"
export type VideoInfoType = {
    videoFormats:videoFormat[],
    videoDetails:MoreVideoDetails,
}