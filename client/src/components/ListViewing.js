import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function ListViewing(props){
    const { store } = useContext(GlobalStoreContext);

    const { items } = props;

    if(store.listsCollectionType === 'COMMUNITY'){
      
        return(    
            <Box sx = {{backgroundColor: "purple", borderRadius: "10px", height: "100%", paddingTop: "0%", width: "96%", paddingLeft: "2%", marginLeft: "2%"}}>
                <Grid container>
                    <Grid item xs = {12} sx = {{paddingTop: "1vh", paddingBottom: ".5vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            1.  {items[0].item}
                        </Typography>
                        <Typography sx = {{fontSize: "12pt", color: "yellow"}}>
                            ({items[0].votes} votes)
                        </Typography>

                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: ".5vh", paddingBottom: ".5vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            2. {items[1].item}
                        </Typography>
                        <Typography sx = {{fontSize: "12pt", color: "yellow"}}>
                            ({items[1].votes} votes)
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: ".5vh", paddingBottom: ".5vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            3. {items[2].item}
                        </Typography>
                        <Typography sx = {{fontSize: "12pt", color: "yellow"}}>
                            ({items[2].votes} votes)
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: ".5vh", paddingBottom: ".5vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            4.  {items[3].item}
                        </Typography>
                        <Typography sx = {{fontSize: "12pt", color: "yellow"}}>
                            ({items[3].votes} votes)
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: ".5vh", paddingBottom: "1vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            5. {items[4].item}
                        </Typography>
                        <Typography sx = {{fontSize: "12pt", color: "yellow"}}>
                            ({items[4].votes} votes)
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    else{
        return (
            <Box sx = {{backgroundColor: "purple", borderRadius: "10px", height: "100%", paddingTop: "0%", width: "96%", paddingLeft: "2%", marginLeft: "2%"}}>
                <Grid container>
                    <Grid item xs = {12} sx = {{paddingTop: "3vh", paddingBottom: "1vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            1.  {items[0]}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: "1vh", paddingBottom: "1vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            2. {items[1]}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: "1vh", paddingBottom: "1vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            3. {items[2]}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: "1vh", paddingBottom: "1vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            4.  {items[3]}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} sx = {{paddingTop: "1vh", paddingBottom: "3vh"}}>
                        <Typography sx = {{fontSize: "24pt", color: "yellow"}}>
                            5. {items[4]}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        )
    }


}