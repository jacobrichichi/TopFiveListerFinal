import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { listInfo, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    const handleStartEdit = (event) => {
        store.openListForEditing(listInfo._id)
    }

    const handleLike = (event) => {

    }
    
    const handleDislike = (event) => {

    }

    const handleDelete = (event) => {
        store.markListForDeletion(listInfo._id)
    }

    const handleExpand = (event) => {

    }

    let publishDateOrEdit = ""
    let backgroundColor = ""

    if(listInfo.isPublished){
        publishDateOrEdit = <Typography variant = "subtitle1">Published: {listInfo.publishDate.toString().split('T')[0]}</Typography>
        backgroundColor = "white"
    }
    else{
        publishDateOrEdit = <Button onClick = {handleStartEdit}>Edit</Button>
        backgroundColor = "#b5b5b5"
    }

    let openedListDetails = ""

    if(selected){
        //set opened list details here
    }

    return(
        <Box sx ={{paddingTop: "16px"}}>
            <Box 
                backgroundColor = {backgroundColor}
                sx = {{border: '2px solid black', borderRadius: "15px" }}
                >
                <Grid container spacing = {2} columns = {17}  sx = {{paddingTop: "1%", paddingLeft: "1%", paddingRight: "1%", paddingBottom: "1%"}}>
                    <Grid item xs = {3}>
                        <Typography variant = "h4" sx = {{paddingBottom: "5%"}}>
                            {listInfo.name}
                        </Typography>

                        <Typography variant = "subtitle1">
                            By:  {listInfo.ownerUsername}
                        </Typography>
                    </Grid>

                    <Grid item xs = {9}>
                    </Grid>

                    <Grid item xs = {2}>
                        <div style ={{display:"flex"}}>
                            <IconButton onClick = {handleLike}>
                                <ThumbUpIcon sx = {{fontSize: "54px"}}/>
                            </IconButton>    

                            <Typography variant = "h5">
                                {listInfo.likes}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs = {2}>

                        <div style ={{display:"flex" }}>
                            <IconButton onClick = {handleDislike}>
                                <ThumbDownIcon sx = {{fontSize: "54px"}}/>
                            </IconButton>    

                            <Typography variant = "h5">
                                {listInfo.dislikes}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs = {1}>

                        <IconButton onClick = {handleDelete}>
                            <DeleteIcon sx = {{fontSize: "54px"}}/>
                        </IconButton>    
                    </Grid>

                </Grid>

                {openedListDetails}

                <Grid container spacing = {2} columns = {17} sx = {{paddingLeft: "1%", paddingRight: "1%"}}>
                    <Grid item xs = {3}>
                        {publishDateOrEdit}
                    </Grid>

                    <Grid item xs = {9}>
                    </Grid>

                    <Grid item xs = {2}>
                        <Typography variant = "h6">Views: {listInfo.views}</Typography>
                    </Grid>

                    <Grid item xs = {2}>
                    </Grid>

                    <Grid item xs = {1}>
                        <IconButton onClick = {handleExpand}>
                            <ExpandMoreIcon sx = {{fontSize: "54px"}}/>
                        </IconButton>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    )


}