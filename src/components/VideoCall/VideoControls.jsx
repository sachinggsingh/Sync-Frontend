import { memo } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const VideoControls = memo(({ isMuted, isVideoOff, onToggleMute, onToggleVideo, onLeave }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-900/90 rounded-xl backdrop-blur-sm shadow-2xl border border-gray-700">
      <button
        onClick={onToggleMute}
        className={`p-3 rounded-full transition-all ${
          isMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-all ${
          isVideoOff ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
        title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
      >
        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      <div className="w-px h-8 bg-gray-600 mx-2" />

      <button
        onClick={onLeave}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg hover:shadow-red-500/20"
        title="Leave Call"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
});

VideoControls.displayName = "VideoControls";
export default VideoControls;
