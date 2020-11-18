import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Scream from "../components/Scream";


function Home(props) {
    const [screams,setScreams] = useState(null)
    useEffect(()=>{
        axios.get("/screams")
            .then(res =>{
                setScreams(res.data)
            })
            .catch(err => console.error(err))
    },[])
    let resentScreamsMarkup = screams ? (screams.map((scream,i) =><Scream key={i} scream={scream}/>)) : <p>Loading...</p>
    return (
        <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {resentScreamsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <p>Profile...</p>
            </Grid>
        </Grid>
    );
}

export default Home;