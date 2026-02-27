import "./App.css";
import MainSidebar from "@/Main/SideBar/MainSidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupLoginLayout from "@/Main/Login-Signup/SignupLoginLayoyt";
import { LoginForm } from "@/Main/Login-Signup/LoginForm";
import { SignupForm } from "@/Main/Login-Signup/SignupForm";
import ProtectedRoute from "@/ProtectedRoute";

function App() {

  console.log("App");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainSidebar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <MainSidebar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <SignupLoginLayout>
              <LoginForm />
            </SignupLoginLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <SignupLoginLayout>
              <SignupForm />
            </SignupLoginLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;