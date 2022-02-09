import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import Groups from "./pages/Groups";
import Rides from "./pages/Rides";
import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Register from "./pages/Registration";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box w="100%" h="200px" />
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Groups groups= {[{name:"group1", number_members:3}, {name:"group2", number_members:6}]}/> } />
            <Route path="/rides" element={<Rides />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </Grid>
    </Box>
  </ChakraProvider>
);
