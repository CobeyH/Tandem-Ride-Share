import * as React from "react";
import {Flex, Box, Heading, FormControl, FormLabel, Input, Button, Text} from "@chakra-ui/react";
import {auth} from "../firebase";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";

export default function Register() {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    // If the user is signed in, go to the home page.
    useEffect(() => {
        if (loading) return;
        if (user) return navigate("/");
    }, [user, loading]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordMatch, setpasswordMatch] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSubmit = () => {
        // Not sure where this info has to go for now, so I just left it blank
        console.log(`Need to implement handleSumbit. Email ${email}, Password: ${password}, First Name: ${firstName}, Last Name: ${lastName}`)
    };

    const checkPassword = (confirmPassword: string) => {
        (confirmPassword == password) ? setpasswordMatch(true) : setpasswordMatch(false);
    }

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Registration Page</Heading>
                </Box>

                <Box my={4} textAlign="left">
                    <form onSubmit={handleSubmit}>
                        <FormControl mt={6} isRequired>
                            <FormLabel>First Name</FormLabel>
                            <Input
                                type="firstName"
                                placeholder="First Name"
                                onChange={(event) => setFirstName(event.currentTarget.value)}
                            />
                        </FormControl>
                        <FormControl mt={6} isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                type="lastName"
                                placeholder="Last Name"
                                onChange={(event) => setLastName(event.currentTarget.value)}
                            />
                        </FormControl>
                        <FormControl mt={6} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="test@test.com"
                                onChange={(event) => setEmail(event.currentTarget.value)}
                            />
                        </FormControl>
                        <FormControl mt={6} isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="*******"
                                onChange={(event) => setPassword(event.currentTarget.value)}
                            />
                        </FormControl>
                        <FormControl mt={6} isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="*******"
                                onChange={(event) => checkPassword(event.currentTarget.value)}
                            />
                            {!passwordMatch && <Text fontSize='sm' color='red.500'>Password has to match</Text>}
                        </FormControl>
                        <Button width="full" mt={4} type="submit">
                            Create Account
                        </Button>
                    </form>
                </Box>
            </Box>
        </Flex>
    );
}
