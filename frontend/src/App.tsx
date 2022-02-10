import * as React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import Groups from "./pages/Groups";
import {ChakraProvider, theme} from "@chakra-ui/react";
import Register from "./pages/Registration";
import CreateGroup from "./pages/CreateGroup";
import GroupPage from "./pages/GroupPage";
import {ColorModeSwitcher} from "./ColorModeSwitcher";

export const App = () => (
    <ChakraProvider theme={theme}>
        <ColorModeSwitcher justifySelf="flex-end"/>
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/" element={<Groups/>}/>
                <Route path="/group/new" element={<CreateGroup/>}/>
                <Route path="/group/:groupId" element={<GroupPage/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </Router>
    </ChakraProvider>
);
