import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import GroupsListPage from "./pages/GroupsListPage";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Register from "./pages/Registration";
import CreateGroup from "./pages/CreateGroup";
import GroupPage from "./pages/GroupPage";
import Ride from "./pages/RidePage";

export const App = () => (
  <ChakraProvider theme={theme}>
    <ColorModeSwitcher justifySelf="flex-end" />
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<GroupsListPage />} />
        <Route path="/group/new" element={<CreateGroup />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ride/:rideId" element={<Ride />} />
      </Routes>
    </Router>
  </ChakraProvider>
);
