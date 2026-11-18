import {Composition} from 'remotion';
import {Clip1Video} from './Clip1Video';

export const RemotionRoot = () => (
  <Composition
    id="Clip1"
    component={Clip1Video}
    durationInFrames={1020} // 34 detik x 30 fps
    fps={30}                // fps: jumlah frame per detik
    width={1920}
    height={1080}           // rasio 16:9
  />
);
