import { useContext, useState } from 'react'
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

    const [text, setText] = useState("");

    const handlePersonalLists = (event) => {
        store.getPersonalLists("");
    }

    const handleAllLists = (event) => {
        store.getAllLists("");
    }

    const handleSwitchToOtherUser = (event) => {
        store.getOtherUsersLists("");
    }

    const handleCommunity = (event) => {
        store.getCommunityLists("");
    }

    const handleSortBy = (event) => {
        
    }

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            if(store.listsCollectionType == 'OTHER_USER'){
                store.getOtherUsersLists(text)
            }
            else if(store.listsCollectionType == 'PERSONAL'){
                store.getPersonalLists(text)
            }
            else if(store.listsCollectionType == 'ALL_LISTS'){
                store.getAllLists(text)
            }
            else{
                store.getCommunityLists(text)
            }

        }
    }

    const handleUpdateText = (event) => {
        setText(event.target.value);
    }

    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }


    return (
        <div>
            <Grid container spacing = {0} columns = {96}>
                <Grid item xs = {5}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handlePersonalLists}>
                            <HomeIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>

                <Grid item xs = {5}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleAllLists}
                        sx = {{height: "100%"}}>
                            <GroupsIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>    

                <Grid item xs = {5}>
                    <IconButton 
                        disabled={editStatus}
                        onClick= {handleSwitchToOtherUser}
                        sx = {{height: "100%"}}>
                            <PersonIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>

                <Grid item xs = {5}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleCommunity}
                        sx = {{height: "100%"}}>
                            <FunctionsIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>    
                
                <Grid item xs = {40}>
                    <TextField 
                            onKeyPress={handleKeyPress}
                            onChange={handleUpdateText}
                            sx = {{width: "100%", paddingTop: "2%"}} 
                            size= "small"/>
                </Grid>

                <Grid item xs = {20}>
                </Grid>

                <Grid item xs = {12}>
                    <Typography variant = "h5" sx ={{paddingTop: "10%"}}>
                        SORT BY
                    </Typography>
                </Grid>

                <Grid item xs = {4}>
                    <IconButton 
                        disabled={editStatus}
                        onClick={handleSortBy}
                        sx = {{height: "100%"}}>
                            <SortIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>
            </Grid>


        </div>
    )
}