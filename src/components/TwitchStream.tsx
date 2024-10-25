import React from 'react';

const TwitchStream: React.FC<{ username: string }> = ({ username }) => (
  <div className="twitch-stream bg-gradient-to-r from-violet-500/80 to-indigo-500/70 shadow-[0_0_50px_10px_rgba(139,92,246,0.7)] rounded-3xl overflow-hidden w-full h-[500px] p-1">
    <iframe
      src={`https://player.twitch.tv/?channel=${username}&parent=localhost`}
      height="100%"
      width="100%"
      allowFullScreen
      frameBorder="0"
      scrolling="no"
      allow="autoplay; fullscreen"
      className="rounded-lg"
      title={`Twitch stream de ${username}`}
    ></iframe>
  </div>
);

export default TwitchStream;
