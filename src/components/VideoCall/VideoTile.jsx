import { memo, useEffect, useRef } from "react";
import { Mic, MicOff, User } from "lucide-react";
import { getUserColor, getUserInitials } from "../../utils/userColors";

const VideoTile = memo(({ stream, username, isMuted, isLocal }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = getUserInitials(username);
  const color = getUserColor(username);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video shadow-lg border border-gray-700 group">
      {/* Video Element */}
      {stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent feedback
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror local video
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
             <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: color }}
             >
              {initials}
            </div>
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs flex items-center gap-2">
        <span className="font-medium truncate max-w-[100px]">{username} {isLocal && "(You)"}</span>
        {isMuted ? (
            <MicOff size={14} className="text-red-400" />
        ) : (
            <Mic size={14} className="text-green-400" />
        )}
      </div>
      
      {/* Speaking Indicator border */}
      {!isMuted && !isLocal && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-lg opacity-0 transition-opacity user-speaking-indicator pointer-events-none" />
      )}
    </div>
  );
});

VideoTile.displayName = "VideoTile";
export default VideoTile;
