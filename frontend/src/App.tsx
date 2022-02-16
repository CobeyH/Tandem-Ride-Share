import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import GroupsListPage from "./pages/GroupsListPage";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Register from "./pages/Registration";
import CreateGroup from "./pages/CreateGroup";
import GroupPage from "./pages/GroupPage";
import CreateRide from "./pages/CreateRide";
import JoinGroup from "./pages/JoinGroup";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export const App = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        {loading || user ? (
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<GroupsListPage />} />
            <Route path="/group/new" element={<CreateGroup />} />
            <Route path="/group/:groupId" element={<GroupPage />} />
            <Route path="/group/:groupId/join" element={<JoinGroup />} />
            <Route path="/register" element={<Register />} />
            <Route path="/group/:groupId/ride/new" element={<CreateRide />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<LoginForm />} />
          </Routes>
        )}
      </Router>
    </ChakraProvider>
  );
};
