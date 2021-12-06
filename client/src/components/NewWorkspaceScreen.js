import { StrictMode, useContext, useState } from 'react'
import Top5Item from './Top5Item.js'
import NewEditToolbar from './NewEditToolbar'
import List from '@mui/material/List';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function NewWorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    const [publishDisabled, setPublishDisabled] = useState(!store.canBePublished)
    const [title, setTitle] = useState("")
    const [ isTitleEditActive, setIsTitleEditActive ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(true)


    function handleUpdateTitle(event) {
        setTitle(event.target.value);
    }

    const handleDoubleClick = (event) => {
        if(!store.isItemEditActive){
            store.setIsItemEditActive(true)
            setIsTitleEditActive(true)

        }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let text = event.target.value;
            store.updateListTitle(title)
            store.setIsItemEditActive(false);
            setIsTitleEditActive(false);
        }
    }

    const handleCloseList = (event) => {
        store.closeEditingList()
    }

    const handleSave = (event) => {

        if(title === ""){
            store.saveList(store.currentList.name)
        }
        else{
            store.saveList(title);
        }
    }

    function handlePublish(event) {
        console.log('handlePublish')
        store.saveList(title);
        if(title === ""){
            store.publishList(store.currentList.name)
        }
        else{
            store.publishList(title);
        }

        setIsModalOpen(true)
        
    }

    const reloadPublish = () => {
        setPublishDisabled(!store.canBePublished)
    }


    const handleCloseModal = (event) => {
        event.stopPropagation();
        store.removePublishError();
        setIsModalOpen(false)
    }

    let modal = ""
    if(store.isPublishError){
        let errorMessage = store.publishError


        modal = <Modal
                    open = {isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >   
                    <Box sx = 
                        {{position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,}}
                        >
                        <Alert severity="warning">{errorMessage}</Alert>
                        <Button variant="outlined" onClick = {handleCloseModal}>OK</Button>
                    </Box>
                </Modal>
    }


    let publishButton = <Button variant = "outlined" onClick = {handlePublish} disabled = {true} sx = {{width: "100%", height: "100%", textTransform: "none" }}>
                            <Typography variant = "h3" sx = {{color: "black"}}>
                                Publish
                            </Typography>
                        </Button>
    if(store.canBePublished){
        publishButton = <Button variant = "outlined" onClick = {handlePublish}  sx = {{width: "100%", height: "100%", textTransform: "none" }}>
                            <Typography variant = "h3" sx = {{color: "black"}}>
                                Publish
                            </Typography>
                        </Button>
    }                

    let editItems = "";

    let titleCard = ""
    if (store.currentList) {
        editItems = 
            <List sx={{ width: '100%', marginLeft: "1%" }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index}
                            reloadPublish = {reloadPublish}

                        />
                    ))
                }
            </List>;

        titleCard = <Typography variant = "h5" onDoubleClick = {handleDoubleClick}>{store.currentList.name}</Typography>

        if(isTitleEditActive){
            titleCard = <TextField
                onChange={handleUpdateTitle}
                onKeyPress={handleKeyPress}
                defaultValue={store.currentList.name}
                size = "small"
                sx ={{backgroundColor: "white"}}
            />
        }    
    }

    return (
        <div>
            <NewEditToolbar/>
            <Box sx = {{border: '2px solid black', borderRadius: "10px", backgroundColor: "#cfcfcf", height: "70vh",width:"90%", padding: "1%", marginTop: "1%", marginLeft: "5%"}}>
                <Grid container columns = {20}>
                    <Grid item xs = {6}>
                        {titleCard}
                    </Grid>
                    <Grid xs = {13}/>

                    <Grid xs = {1}>
                        <IconButton onClick = {handleCloseList}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Box sx = {{ borderRadius: "15px", backgroundColor: "#0a1d53", height: "80%", width: "100%", marginTop: "1%"}}>
                    {editItems}
                </Box>

                <Grid container spacing = {2} columns = {16} sx = {{paddingTop: "12px", height: "14%"}}>
                    <Grid item xs = {10}/> 

                    <Grid item xs = {3}>
                        <Button variant = "outlined" onClick = {handleSave} sx = {{width: "100%", height: "100%", textTransform: "none"}}>
                            <Typography variant = "h3" sx = {{color: "black"}}>
                                Save
                            </Typography>
                        </Button>
                    </Grid>

                    <Grid item xs = {3}>
                        {publishButton}
                    </Grid>
                </Grid>

            </Box>

            <div style= {{ display: "flex", width: "100%", paddingLeft: "40%"}}>
                    <IconButton
                        disabled = "true">
                            <AddIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>   
                    <Typography variant = "h4" sx = {{paddingTop: "1%"}}>
                        Your List
                    </Typography> 
                </div>
            {modal}
        </div>
    )
}

export default NewWorkspaceScreen;