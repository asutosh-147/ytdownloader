import { useState } from "react";
import "./App.css";
const backendUrl = "http://localhost:3000";
function App() {
  const [url, setUrl] = useState("");
  const handleClick = async () => {
    try {
      const response = await fetch(`${backendUrl}/download?url=${url}`);
      console.log(response);
      const blob = await response.blob();
      console.log(blob.size);
      const durl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = durl;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(durl);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div>
        <label htmlFor="video-url">Link</label>
        <input
          id="video-url"
          type="text"
          style={{ padding: 9, marginRight: 10 }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleClick}>download</button>
        <a href={`${backendUrl}/download?url=${url}`} download="video.mkv">
          Download Video
        </a>
      </div>
    </>
  );
}

export default App;
