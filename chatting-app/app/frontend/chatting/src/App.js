import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChattingPage from "./pages/ChattingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div className="App text-black text-opacity-[80%]	">
      <Routes>
        <Route path="/" element={<SignIn></SignIn>} />
        <Route path="/signin" element={<SignIn></SignIn>} />
        <Route path="/signup" element={<SignUp></SignUp>} />
        <Route path="/chatting" element={<ChattingPage></ChattingPage>} />
      </Routes>
    </div>
  );
}

export default App;
