import * as React from "react";
import {Center, Heading, Spinner, Text} from "@chakra-ui/react";
import {useNavigate, useParams} from "react-router-dom";
import {db} from "../firebase";
import {ref} from "firebase/database";
import {Group} from "./Groups";
import {Val} from "react-firebase-hooks/database/dist/database/types";

import {useObjectVal} from "react-firebase-hooks/database";

export default function GroupPage() {
    const navigate = useNavigate()
    const groupId = useParams()["groupId"]
    console.log(useParams())
    if (groupId === undefined) {
        console.log("figure something better to do here")
        navigate("/")
    }
    const [group, loading, error] = useObjectVal<Group>(ref(db, `groups/${groupId}`))

    return (
        <Center>
            {loading ?
                <Spinner/> :
                (error ?
                        <Text>{JSON.stringify(error)}</Text> :
                        (group ?
                                <SingleGroup group={group}/> :
                                <Text>No such group exists</Text>
                        )
                )
            }
        </Center>
    );
}

const SingleGroup = ({group}: { group: Val<Group> }) => <>
    <Heading>{group.name}</Heading>
</>

