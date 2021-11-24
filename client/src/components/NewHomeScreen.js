import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import NewEditToolbar from './NewEditToolbar'
import NewListCard from './NewListCard'
import MUIDeleteModal from './MUIDeleteModal'

import List from '@mui/material/List';

export default function NewHomeScreen(){
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let editToolbar = "";
    if(auth.user || auth.isGuest){
        editToolbar = <NewEditToolbar/>
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%' }}>
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
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>

            
        </div>
    )

}