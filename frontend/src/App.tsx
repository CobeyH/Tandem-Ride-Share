import * as React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import Groups from "./pages/Groups";
import {Box, ChakraProvider, Grid, theme} from "@chakra-ui/react";
import {ColorModeSwitcher} from "./ColorModeSwitcher";
import Register from "./pages/Registration";
import CreateGroup from "./pages/CreateGroup";
import GroupPage from "./pages/GroupPage";
import Ride from "./pages/RidePage";

export const App = () => (
     <ChakraProvider theme={theme}>
        <Box w="100%" h="200px"/>
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end"/>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/" element={<Groups/>}/>
                            <Route path="/group/new" element={<CreateGroup/>}/>
                            <Route path="/group/:groupId" element={<GroupPage/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/ride/:rideId" element={<Ride/>}/>
                    </Routes>
                </Router>
            </Grid>
        </Box>
    </ChakraProvider>
);
