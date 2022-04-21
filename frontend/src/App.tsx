import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Center, ChakraProvider, Container, Spinner } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import { NavConstants } from "./NavigationConstants";
import { ReactNode } from "react";
import extendedTheme from "./theme/style";
import Fonts from "./theme/components/font";
import { AuthProvider } from "./firebase/AuthContent";

const LazyGroupsListPage = React.lazy(() => import("./pages/WelcomePage"));
const LazyCreateGroup = React.lazy(() => import("./pages/CreateGroup"));
const LazyGroupPage = React.lazy(() => import("./pages/GroupPage"));
const LazyCreateRide = React.lazy(() => import("./pages/CreateRide"));
const LazyProductPage = React.lazy(() => import("./pages/ProductPage"));
const LazyRegistration = React.lazy(() => import("./pages/Registration"));
const LazyJoinGroup = React.lazy(() => import("./pages/JoinGroup"));

export const LoadingPage = () => (
  <Container>
    <Center mt={"50%"}>
      <Spinner size={"lg"} />
    </Center>
  </Container>
);

const LazyLoad = ({ children }: { children?: ReactNode | undefined }) => (
  <React.Suspense fallback={LoadingPage()}>{children}</React.Suspense>
);

const LazyLoginPage = React.lazy(() => import("./pages/LoginPage"));

export const App = () => {
  return (
    <AuthProvider>
      <ChakraProvider theme={extendedTheme}>
        <Fonts />
        <Router>
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
              path="/welcome"
              element={
                <RequireAuth>
                  <LazyLoad>
                    <LazyGroupsListPage />
                  </LazyLoad>
                </RequireAuth>
              }
            />
            <Route
              path="/group/new"
              element={
                <RequireAuth>
                  <LazyLoad>
                    <LazyCreateGroup />
                  </LazyLoad>
                </RequireAuth>
              }
            />
            <Route
              path="/group/:groupId"
              element={
                <RequireAuth>
                  <LazyLoad>
                    <LazyGroupPage />
                  </LazyLoad>
                </RequireAuth>
              }
            />
            <Route
              path="/group/:groupId/ride/new"
              element={
                <RequireAuth>
                  <LazyLoad>
                    <LazyCreateRide />
                  </LazyLoad>
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </ChakraProvider>
    </AuthProvider>
  );
};

function RequireAuth({ children }: { children: JSX.Element }) {
  const [user, loading] = useAuthState(auth);
  return user || loading ? (
    children
  ) : (
    <Navigate to={NavConstants.PRODUCT_PAGE} replace />
  );
}
