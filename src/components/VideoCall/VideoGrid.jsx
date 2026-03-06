import { memo, useMemo } from "react";
import VideoTile from "./VideoTile";
import VideoControls from "./VideoControls";

const VideoGrid = memo(({ 
  localStream, 
  remoteStreams, 
  localUser, 
  isMuted, 
  isVideoOff, 
  onToggleMute, 
  onToggleVideo, 
  onLeave 
}) => {
  
  // Combine local and remote participants for grid
  const participants = useMemo(() => {
    const list = [];
    
    // Local user
    list.push({
      id: "local",
      username: localUser,
      stream: localStream,
      isLocal: true,
      isMuted: isMuted // Local mute state
    });

    // Remote users
    remoteStreams.forEach((streamInfo) => {
        list.push({
            id: streamInfo.id,
            username: streamInfo.username,
            stream: streamInfo.stream,
            isLocal: false,
            isMuted: streamInfo.isMuted
        });
    });

    return list;
  }, [localStream, remoteStreams, localUser, isMuted]);

  // Dynamic grid layout class based on participant count
  const gridClass = useMemo(() => {
     const count = participants.length;
     if (count <= 1) return "grid-cols-1";
     if (count === 2) return "grid-cols-1 md:grid-cols-2";
     if (count <= 4) return "grid-cols-2";
     if (count <= 6) return "grid-cols-2 md:grid-cols-3";
     if (count <= 9) return "grid-cols-3";
     return "grid-cols-3 md:grid-cols-4";
  }, [participants.length]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden relative">
        <div className={`flex-1 grid ${gridClass} gap-4 p-4 overflow-y-auto content-center`}>
            {participants.map((p) => (
                <div key={p.id} className="w-full h-full min-h-[200px] flex items-center justify-center">
                    <VideoTile 
                        stream={p.stream}
                        username={p.username}
                        isLocal={p.isLocal}
                        isMuted={p.isMuted}
                    />
                </div>
            ))}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <VideoControls 
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onToggleMute={onToggleMute}
                onToggleVideo={onToggleVideo}
                onLeave={onLeave}
            />
        </div>
    </div>
  );
});

VideoGrid.displayName = "VideoGrid";
export default VideoGrid;
