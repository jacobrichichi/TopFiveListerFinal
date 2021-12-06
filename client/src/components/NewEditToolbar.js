import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';

export default function NewEditToolbar(){
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [text, setText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

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

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleSortByDateOldest = (event) => {
        if(store.listsCollectionType==='COMMUNITY'){
            store.sortCommunityByDateOldest()
        }
        else{
            store.sortByDateOldest();
        }
        setAnchorEl(null);
    }

    const handleSortByDateNewest = (event) => {
        if(store.listsCollectionType==='COMMUNITY'){
            store.sortCommunityByDateNewest()
        }
        else{
            store.sortByDateNewest();
        }
        setAnchorEl(null);
    }
    const handleSortByViews = (event) => {
        store.sortByViews();
        setAnchorEl(null);
    }
    const handleSortByLikes = (event) => {
        store.sortByLikes();
        setAnchorEl(null);
    }
    const handleSortByDislikes = (event) => {
        store.sortByDislikes();
        setAnchorEl(null);
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

    let sortMenu = <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        id= 'primary-search-account-menu'
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleSortByDateOldest}>Oldest</MenuItem>
                        <MenuItem onClick={handleSortByDateNewest}>Newest</MenuItem>
                        <MenuItem onClick={handleSortByViews}>Views</MenuItem>
                        <MenuItem onClick={handleSortByLikes}>Likes</MenuItem>
                        <MenuItem onClick={handleSortByDislikes}>Dislikes</MenuItem>
                    </Menu>



    let disabled = false;
    if (store.inWorkspace) {
        disabled = true;
    }


    return (
        <div>
            <Grid container spacing = {0} columns = {96}>
                <Grid item xs = {5}>
                    <IconButton 
                        disabled={disabled}
                        onClick={handlePersonalLists}>
                            <HomeIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>

                <Grid item xs = {5}>
                    <IconButton 
                        disabled= {disabled}
                        onClick={handleAllLists}
                        sx = {{height: "100%"}}>
                            <GroupsIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>    

                <Grid item xs = {5}>
                    <IconButton 
                        disabled={disabled}
                        onClick= {handleSwitchToOtherUser}
                        sx = {{height: "100%"}}>
                            <PersonIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>

                <Grid item xs = {5}>
                    <IconButton 
                        disabled={disabled}
                        onClick={handleCommunity}
                        sx = {{height: "100%"}}>
                            <FunctionsIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>    
                
                <Grid item xs = {40}>
                    <TextField 
                            disabled = {disabled}
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
                        disabled={disabled}
                        onClick={handleMenuOpen}
                        sx = {{height: "100%"}}
                        onClick = {handleMenuOpen}>
                            <SortIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>
                </Grid>
                {sortMenu}
            </Grid>


        </div>
    )
}