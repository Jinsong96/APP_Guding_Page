import React from 'react';

interface Stage00StartProps {
  onStart: () => void;
  onBrowse: () => void;
}

// The start scene is one flat illustration, so the train "pulls in" through layers on top of it
// (start-arrival.css): the camera glides in and brakes, light from passing windows and rail glints
// slow down, then the headlight flares and the engine lets off steam.
export const Stage00Start: React.FC<Stage00StartProps> = ({ onStart, onBrowse }) => (
  <div className="relative h-full w-full overflow-hidden bg-[#101b35] text-white">
    <div className="st-camera" aria-hidden="true">
      <div className="st-brake">
        <img
          src={`${import.meta.env.BASE_URL}assets/readpal-start-scene.png`}
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
        />
        <span className="st-window-sweep st-window-sweep-left" />
        <span className="st-window-sweep st-window-sweep-right" />
        <span className="st-rail-glint" />
        <span className="st-headlight-beam" />
        <span className="st-headlight" />
        <span className="st-steam">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
    <div className="st-night-fade" aria-hidden="true" />

    <div className="sr-only">
      <h1>ReadPal</h1>
      <p>阅读，自有同路人</p>
      <p>下一程，一起读。选一位旅伴，按自己的节奏出发。</p>
    </div>

    <button
      type="button"
      onClick={onStart}
      aria-label="遇见我的旅伴"
      className="absolute left-[2%] top-[85%] z-10 h-[8%] w-[96%] rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
    />
    <button
      type="button"
      onClick={onBrowse}
      aria-label="先随便看看"
      className="absolute left-[25%] top-[95%] z-10 h-[5%] w-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    />
  </div>
);
