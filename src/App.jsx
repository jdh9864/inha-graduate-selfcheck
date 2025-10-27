import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Check from "./pages/check";
import Result from "./pages/result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<Check />} />
        <Route path="/result" element={<Result />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


