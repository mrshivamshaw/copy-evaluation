import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignPage from "./pages/SignPage/SignPage";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import OpenRoute from "./components/OpenRoute/OpenRoute";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  const { loading } = useSelector((state) => state.ui);

  return (
    <div className="max-w-[100vw] min-h-[100vh] overflow-x-hidden box-border relative z-10 bg-blue-bg">
      {loading && <Loader />}
      <Routes>
        <Route
          path="/login"
          element={
            <OpenRoute>
              <LoginPage />
            </OpenRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <OpenRoute>
              <SignPage />
            </OpenRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
