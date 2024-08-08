import DownloadInfo from "./components/DownloadInfo";
import Features from "./components/Features";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Features />
              </>
            }
          />
          <Route path="/download" element={<DownloadInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
