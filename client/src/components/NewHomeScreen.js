import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import NewEditToolbar from './NewEditToolbar'

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

    return (
        <div>
            {editToolbar}


            
        </div>
    )

}