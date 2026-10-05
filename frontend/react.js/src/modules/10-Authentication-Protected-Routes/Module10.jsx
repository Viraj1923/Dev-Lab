import { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import { AuthContext, AuthProvider } from "./AuthContext";
function Module10() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <NavBar />

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default  Module10;