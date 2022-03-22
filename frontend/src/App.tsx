import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ChakraProvider, Container, Spinner } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import { NavConstants } from "./NavigationConstants";
import { ReactNode, useEffect } from "react";
import extendedTheme from "./theme/style";
import Fonts from "./theme/components/font";

const LazyGroupsListPage = React.lazy(() => import("./pages/GroupsListPage"));
const LazyCreateGroup = React.lazy(() => import("./pages/CreateGroup"));
const LazyGroupPage = React.lazy(() => import("./pages/GroupPage"));
const LazyCreateRide = React.lazy(() => import("./pages/CreateRide"));
const LazyProductPage = React.lazy(() => import("./pages/ProductPage"));
const LazyRegistration = React.lazy(() => import("./pages/Registration"));
const LazyJoinGroup = React.lazy(() => import("./pages/JoinGroup"));

const LazyLoad = ({ children }: { children?: ReactNode | undefined }) => (
  <React.Suspense
    fallback={
      <Container>
        <Spinner size={"lg"} />
      </Container>
    }
  >
    {children}
  </React.Suspense>
);

const LazyLoginPage = React.lazy(() => import("./pages/LoginPage"));

export const App = () => {
  const [user] = useAuthState(auth);

  return (
    <ChakraProvider theme={extendedTheme}>
      <Fonts />
      <Router>
        {user ? (
          <Routes>
            <Route
              path="/login"
              element={
                <LazyLoad>
                  <LazyLoginPage />
                </LazyLoad>
              }
            />
            <Route
              path="/"
              element={
                <LazyLoad>
                  <LazyGroupsListPage />
                </LazyLoad>
              }
            />
            <Route
              path="/group/new"
              element={
                <LazyLoad>
                  <LazyCreateGroup />
                </LazyLoad>
              }
            />
            <Route
              path="/group/:groupId"
              element={
                <LazyLoad>
                  <LazyGroupPage />
                </LazyLoad>
              }
            />
            <Route
              path="/group/:groupId/join"
              element={
                <LazyLoad>
                  <LazyJoinGroup />
                </LazyLoad>
              }
            />
            <Route
              path="/register"
              element={
                <LazyLoad>
                  <LazyRegistration />
                </LazyLoad>
              }
            />
            <Route
              path="/group/:groupId/ride/new"
              element={
                <LazyLoad>
                  <LazyCreateRide />
                </LazyLoad>
              }
            />
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <LazyLoad>
                  <LazyProductPage />
                </LazyLoad>
              }
            />
            <Route
              path="/login"
              element={
                <LazyLoad>
                  <LazyLoginPage />
                </LazyLoad>
              }
            />
            <Route
              path="/register"
              element={
                <LazyLoad>
                  <LazyRegistration />
                </LazyLoad>
              }
            />
            <Route
              path="/group/:groupId/join"
              element={
                <LazyLoad>
                  <LazyJoinGroup />
                </LazyLoad>
              }
            />
            <Route
              path="*"
              element={<Redirect to={NavConstants.PRODUCT_PAGE} />}
            />
          </Routes>
        )}
      </Router>
    </ChakraProvider>
  );
};

const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, []);

  return <></>;
};
