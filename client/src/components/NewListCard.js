import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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

    function toggleEdit(event){

    }

    const handleLike = (event) => {

    }
    
    const handleDislike = (event) => {

    }

    const handleDelete = (event) => {

    }

    const handleExpand = (event) => {

    }

    let publishDateOrEdit = ""
    let backgroundColor = ""

    if(listInfo.publishDate){
        publishDateOrEdit = <Typography variant = "subtitle1">Published: {listInfo.publishDate.toString().split('T')[0]}</Typography>
        backgroundColor = "white"
    }
    else{
        publishDateOrEdit = <Typography variant = "h6">Edit</Typography>
        backgroundColor = "gray"
    }

    let openedListDetails = ""

    if(selected){
        //set opened list details here
    }

    return(
        <div style ={{paddingTop: "16px"}}>
            <Box 
                backgroundColor = {backgroundColor}
                sx = {{border: '2px solid black', borderRadius: "15px" }}
                >
                <Grid container spacing = {2} columns = {17}  sx = {{paddingTop: "1%", paddingLeft: "1%", paddingRight: "1%"}}>
                    <Grid item xs = {3}>
                        <Typography variant = "h4">
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
                                <ThumbUpIcon/>
                            </IconButton>    

                            <Typography variant = "h5">
                                {listInfo.likes}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs = {2}>

                        <div style ={{display:"flex" }}>
                            <IconButton onClick = {handleDislike}>
                                <ThumbDownIcon />
                            </IconButton>    

                            <Typography variant = "h5">
                                {listInfo.dislikes}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs = {1}>

                        <IconButton onClick = {handleDelete}>
                            <DeleteIcon/>
                        </IconButton>    
                    </Grid>

                </Grid>

                {openedListDetails}

                <Grid container spacing = {2} columns = {17} sx = {{paddingBottom: "1%", paddingLeft: "1%", paddingRight: "1%"}}>
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
                            <ExpandMoreIcon/>
                        </IconButton>
                    </Grid>

                </Grid>
            </Box>
        </div>
    )


}