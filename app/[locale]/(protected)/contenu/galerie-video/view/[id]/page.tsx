import VideoInfo from "@/features/galeries/videos/components/video-list/video-info";
import {prefetchVideoDetailQuery, useVideoDetailQuery} from "@/features/galeries/videos/queries/video-details.query";

const VideoViewPage = async ({params}:{params:{id:string}}) => {
    const videoId = await params.id;
    await prefetchVideoDetailQuery(videoId);
    return (
        <VideoInfo />
    );
};

export default VideoViewPage;
