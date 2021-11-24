import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';

export default function NewEditToolbar(){
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);



    const handlePersonalLists = (event) => {
        store.getPersonalLists()
    }

    const handleAllLists = (event) => {

    }

    const handleOtherUser = (event) => {

    }

    const handleCommunity = (event) => {
        
    }

    const handleSortBy = (event) => {
        
    }

    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }


    return (
        <div>
            <Grid container spacing = {1} columns = {23}>
                <Grid item xs = {1}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handlePersonalLists}
                        sx = {{height: "100%"}}
                        size = "large">
                            <HomeIcon fontSize = "large"/>
                    </IconButton>
                </Grid>

                <Grid item xs = {1}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleAllLists}
                        sx = {{height: "100%"}}
                        size = "large">
                            <GroupsIcon fontSize = "large" />
                    </IconButton>
                </Grid>    

                <Grid item xs = {1}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleOtherUser}
                        sx = {{height: "100%"}}
                        size = "large">
                            <PersonIcon fontSize = "large"/>
                    </IconButton>
                </Grid>

                <Grid item xs = {1}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleCommunity}
                        sx = {{height: "100%"}}
                        size = "large">
                            <FunctionsIcon fontSize = "large"/>
                    </IconButton>
                </Grid>    
                
                <Grid item xs = {10}>
                    <TextField sx = {{width: "100%", paddingTop: "2%"}} size= "small"/>
                </Grid>

                <Grid item xs = {6}>
                </Grid>

                <Grid item xs = {2}>
                    <Typography variant = "h5" sx ={{paddingTop: "10%"}}>
                        SORT BY
                    </Typography>
                </Grid>

                <Grid item xs = {1}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleSortBy}
                        sx = {{height: "100%"}}
                        size = "large">
                            <SortIcon fontSize = "large"/>
                    </IconButton>
                </Grid>
            </Grid>


        </div>
    )
}