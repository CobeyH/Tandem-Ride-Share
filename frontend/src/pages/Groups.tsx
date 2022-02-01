import * as React from "react";
import { Button, Flex, Box, Heading, Link, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useEffect } from "react";
import {useEffect} from "react";
import {Box, Button, Flex, Heading, Link, Spinner, Text} from "@chakra-ui/react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {auth, db, logout} from "../firebase";
import {ref} from "firebase/database";
import {useListVals} from "react-firebase-hooks/database";

export type Group = { id: string, name: string, rides: string[] };

export default function Groups() {
    const [user, loading] = useAuthState(auth);
    const [groups, loadingGroups, error] = useListVals<Group>(ref(db, "groups"));

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
    }, [user, loading]);

    return (
        <Flex width="full" align="start" justifyContent="center">
            <Box textAlign="center">
                <Heading>Groups Page</Heading>
                <Button onClick={logout}>Logout</Button>
                {groups?.map((groups, i) => <Heading key={i}>{groups.name}</Heading>)}
                {loadingGroups ? <Spinner/> : null}
                {error ? <Text>{JSON.stringify(error)}</Text> : null}
                <Link href={"group/new"}>Create a Group</Link>
            </Box>
        </Flex>
    );
}
