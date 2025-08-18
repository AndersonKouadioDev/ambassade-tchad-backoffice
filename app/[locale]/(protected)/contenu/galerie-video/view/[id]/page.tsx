import VideoInfo from "@/features/galeries/videos/components/video-list/video-info";
import { prefetchVideoDetailQuery } from "@/features/galeries/videos/queries/video-details.query";

export default async function VideoViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await prefetchVideoDetailQuery(id);
  return <VideoInfo />;
}
