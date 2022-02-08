import * as React from "react";
import LoginForm from "./pages/LoginPage";
import { ChakraProvider, Box, VStack, Grid, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box w="100%" h="200px" />
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <LoginForm />
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
);
