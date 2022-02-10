import React, {useState} from "react";
import {Button, Heading, Input, InputGroup, Text} from "@chakra-ui/react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useNavigate} from "react-router-dom";
import {ref, push} from "firebase/database";
import {Ride,defaultMapCenter} from "./RidePage";
import {MapContainer,TileLayer,Marker} from "react-leaflet";

type ValidatableFiled<T> = {
    field: T
    invalid: boolean
}

const createRide = async (ride: Ride) => await push(ref(db, "rides"), ride)

const CreateGroup = () => {
    const [user] = useAuthState(auth)
    const [{field: title, invalid: invalidTitle}, setTitle] = useState<ValidatableFiled<string>>({
        field: user ? user.displayName + "'s Ride" : "",
        invalid: false
    })

    const isInvalidTitle = (name: string) => name.length === 0
    const navigate = useNavigate();

    return (
        <>
            <Heading>Create Ride</Heading>
            <InputGroup>
                <Text mb={"8px"}>Title</Text>
                <Input
                    value={title}
                    placeholder={"Title"}
                    onInput={e => setTitle({
                        field: e.currentTarget.value,
                        invalid: isInvalidTitle(e.currentTarget.value)
                    })}
                    isInvalid={invalidTitle}/>
                <Button onClick={() => {
                    createRide({title, start: [0,0], end: [0,0]}).then((id) => {
                        navigate(`/ride/${id}`);
                    })
                }}>Create</Button>
            </InputGroup>
            <MapContainer 
                center={defaultMapCenter} 
                zoom={12}
                scrollWheelZoom={false}
            >
                <Marker 
                    position={defaultMapCenter} 
                    draggable={true}
                />
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </>
    );
}

export default CreateGroup