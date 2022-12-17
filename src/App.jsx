
import { useEffect, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState('');
  const [gif, setGif] = useState('');

  const load = async () => {
    await ffmpeg.isLoaded();
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGiffy = async () => {

    // write the file to memory as "test.mp4"
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // run the FFmpeg command
    await ffmpeg.run("-i", "test.mp4", "-t", "2.5", "-ss", "2.0", "-f", "gif", "out.gif");

    // read the results
    const data = ffmpeg.FS('readFile', "out.gif");

    // create URL obj & store in state
    const url = URL.createObjectURL(new Blob([data.buffer], {type: "image/gif"}))
    url && setGif(url);
  }

  return ready ? (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
    <h1 className="text-3xl">Convert Video to Gif</h1>
      { video ? <video controls width="250" src={URL.createObjectURL(video)}></video> : <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />}
    <div>
      <button onClick={convertToGiffy}>Convert 🔃</button>
        <h3>Your Giffy</h3>
        {gif && <img src={gif} />}
      </div>
    </div>
  ) : (
    <p>loading...</p>
  );
}

export default App
