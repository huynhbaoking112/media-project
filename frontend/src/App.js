import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Rightbar from "./components/Rightbar.jsx";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "./components/Search.jsx"
import PostPage from "./pages/PostPage.jsx";
import Error from "./pages/Error.jsx";
import Messenger from "./pages/Messenger.jsx";
import UserCall from "./pages/UserCall.jsx";
import ReplyCall from "./pages/ReplyCall.jsx";
import Setting from "./pages/Setting.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            Object.keys(user).length != 0 ? (
              <div>
                <Navbar />
                <div className="flex w-full mt-[60px]  ">
                  <Feed />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            Object.keys(user).length != 0 ? (
              <Navigate to="/" />
            ) : (
              <div>
                <Login />
              </div>
            )
          }
        />
        <Route
          path="/verify/:id"
          element={
            Object.keys(user).length != 0 ? (
              <Navigate to="/" />
            ) : (
              <div>
                <VerifyPage />
              </div>
            )
          }
        />


        

        <Route
          path="/register"
          element={
            Object.keys(user).length != 0 ? (
              <Navigate to="/" />
            ) : (
              <div>
                <Register />
              </div>
            )
          }
        />



        <Route
          path="/userprofile/:userId"
          element={
            Object.keys(user).length != 0 ? (
              <div>
                <Navbar />
                <div className="flex w-full mt-[60px]">
                  <div className="flex w-full">
                    <Sidebar />
                    <Profile />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/setting"
          element={
            Object.keys(user).length != 0 ? (
              <div>
                <Navbar />
                <div className="flex w-full mt-[60px]">
                  <div className="flex w-full">
                      <Setting/>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

<Route
          path="/callUser/:userid"
          element={
            Object.keys(user).length != 0 ? (
              <div className="h-screen w-full">
                  <UserCall/>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/replyCall/:userid"
          element={
            Object.keys(user).length != 0 ? (
              <div className="h-screen w-full">
                  <ReplyCall/>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        


         <Route
          path="/post/:postid"
          element={
            Object.keys(user).length != 0 ? (
              <div>
                <div className="flex w-full">
                  <div className="flex w-full">
                    <PostPage/>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/top" element={ Object.keys(user).length != 0 ? (
              <div>
                <Navbar />
                <div className="flex w-full mt-[60px]">
                  <div className="flex w-full">
                    <Sidebar/>
                    <Search/>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )}  />

<Route path="/messenger" element={ Object.keys(user).length != 0 ? (
              <div>
                <Navbar />
                <div className="flex w-full mt-[60px]">
                  <div className="flex w-full">
                    <Messenger/>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )}  />

            <Route path="/error/404" element={<Error/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
