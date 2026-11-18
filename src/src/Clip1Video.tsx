import {AbsoluteFill, OffthreadVideo, Sequence, interpolate,
  staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// fromSec = detik awal di file clip1.mp4, durSec = durasi potongan.
const SEGMENTS = [
  {fromSec: 40, durSec: 3},   // hook
  {fromSec: 0,  durSec: 3},   // konteks
  {fromSec: 10, durSec: 10},  // alasan 1
  {fromSec: 30, durSec: 10},  // alasan 2
  {fromSec: 60, durSec: 8},   // payoff
];

// start dan end dalam detik pada video akhir (bukan file sumber).
const SUBS = [
  {start: 0, end: 3, text: 'Isi ucapan hook sesuai audio asli'},
  {start: 3, end: 6, text: 'Isi ucapan konteks'},
];

const OVERLAYS = [
  {start: 0, end: 3, text: 'Kenapa Radit pakai Gemini?'},
  {start: 3, end: 6, text: 'Radit jelaskan alasannya di podcast'},
  {start: 6, end: 26, text: 'Dipakai untuk ide, ringkasan, dan struktur'},
];

const Fade: React.FC<{start: number; end: number; children: React.ReactNode}> =
  ({start, end, children}) => {
    const f = useCurrentFrame();
    const {fps} = useVideoConfig();
    const s = start * fps, e = end * fps;
    // interpolate memetakan rentang frame ke nilai opasitas 0-1.
    const opacity = interpolate(f, [s, s + 8, e - 8, e], [0, 1, 1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return f >= s && f <= e ? <div style={{opacity}}>{children}</div> : null;
  };

export const Clip1Video: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  // Push-in digital: zoom perlahan 100% ke 106% agar visual terasa hidup.
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  let cursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        {SEGMENTS.map((s, i) => {
          const from = cursor;
          const dur = s.durSec * fps;
          cursor += dur;
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <OffthreadVideo src={staticFile('clip1.mp4')}
                startFrom={s.fromSec * fps} />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {OVERLAYS.map((o, i) => (
        <AbsoluteFill key={i} style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 90}}>
          <Fade start={o.start} end={o.end}>
            <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 64,
              color: '#fff', WebkitTextStroke: '3px #000', textAlign: 'center'}}>
              {o.text}
            </div>
          </Fade>
        </AbsoluteFill>
      ))}

      {SUBS.map((s, i) => (
        <AbsoluteFill key={i} style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 130}}>
          <Fade start={s.start} end={s.end}>
            <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 46,
              color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '8px 20px', borderRadius: 8}}>
              {s.text}
            </div>
          </Fade>
        </AbsoluteFill>
      ))}

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40}}>
        <Fade start={28} end={34}>
          <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 38,
            color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '10px 24px', borderRadius: 8, textAlign: 'center'}}>
            Tonton full podcast Raditya Dika x Rexx di YouTube<br />
            youtu.be/547QQM48070 | #Sponsored @googleindonesia
          </div>
        </Fade>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
