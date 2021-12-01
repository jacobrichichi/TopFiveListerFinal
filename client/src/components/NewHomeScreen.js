import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import NewEditToolbar from './NewEditToolbar'
import NewListCard from './NewListCard'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';

export default function NewHomeScreen(){
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateList(event){
        store.createNewList();
    }

    let editToolbar = "";
    if(auth.user || auth.isGuest){
        editToolbar = <NewEditToolbar/>
    }

    let bottomText = "Your Lists";

    if(store.listsCollectionType === 'ALL_LISTS'){
        if(store.searchCriteria !== ''){
            bottomText = store.searchCriteria + " Lists";
        }
        else{
            bottomText = "All Lists";
        }
    }

    else if(store.listsCollectionType === 'OTHER_USER'){
        bottomText = store.searchCriteria + " Lists";
    }

    else if(store.listsCollectionType === 'COMMUNITY_LISTS'){
        if(store.searchCriteria !== ''){
            bottomText = store.searchCriteria + " Community Lists";
        }
        else{
            bottomText = "Community Lists";
        }
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%'}}>
            {
                store.listsInfo.map((listInfo) => (
                    <NewListCard
                        key={listInfo._id}
                        listInfo={listInfo}
                        selected={false}
                    />
                ))
            }
            </List>;


    }

    return (
        <div>
            {editToolbar}
            <div>
                <div style = {{height: "75vh", overflow: "scroll"}}>
                    {
                        listCard
                    }
                </div>
                <div style= {{ display: "flex", width: "100%", paddingLeft: "40%"}}>
                    <IconButton
                        onClick = {handleCreateList}>
                            <AddIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>   
                    <Typography variant = "h4" sx = {{paddingTop: "1%"}}>
                        {bottomText}
                    </Typography> 
                </div>

                <MUIDeleteModal />
            </div>

            
        </div>
    )

}