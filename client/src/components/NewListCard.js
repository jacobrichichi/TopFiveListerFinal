import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import ListViewing from './ListViewing';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const { listInfo } = props;

    const [isExpanded, setIsExpanded] = useState(false)
    const [ newComment, setNewComment] = useState("")
    const [ isLiked, setIsLiked ] = useState(listInfo.liked)
    const [ isDisliked, setIsDisliked ] = useState(listInfo.disliked)

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
        store.likeList(listInfo._id)
        let newLike = !isLiked
        setIsLiked(newLike)
    }
    
    const handleDislike = (event) => {
        store.dislikeList(listInfo._id)

        let newDislike = !isDisliked
        setIsDisliked(newDislike)
    }

    const handleDelete = (event) => {
        store.markListForDeletion(listInfo._id)
    }

    const handleExpandMore = (event) => {

        store.expandList(listInfo._id)
        setIsExpanded(true)
    }

    const handleExpandLess = (event) => {
        setIsExpanded(false)
    }

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            if(newComment !== ""){
                store.addNewComment(newComment, listInfo)
            }
        }

    }

    const handleUpdateComment = (event) => {
        setNewComment(event.target.value)
    }

    let publishDateOrEdit = ""
    let backgroundColor = ""
    let deleteIcon = <IconButton onClick = {handleDelete}>
                        <DeleteIcon sx = {{fontSize: "54px"}}/>
                    </IconButton> 

    if(listInfo.isPublished){
        publishDateOrEdit = <Typography variant = "subtitle1">Published: {listInfo.publishDate.toString().split('T')[0]}</Typography>
        backgroundColor = "white"
    }

    else if(store.listsCollectionType === 'COMMUNITY'){
        publishDateOrEdit = <Typography variant = "subtitle1">Updated: {listInfo.lastEditDate.toString().split('T')[0]}</Typography>
        backgroundColor = "#76b5b5"
        deleteIcon = ""
    }

    else{
        publishDateOrEdit = <Button onClick = {handleStartEdit}>Edit</Button>
        backgroundColor = "#b5b5b5"
    }

    let likeButton =<IconButton onClick = {handleLike}>
                        <ThumbUpIcon sx = {{fontSize: "54px"}}/>
                    </IconButton>    
    let dislikeButton = <IconButton onClick = {handleDislike}>
                            <ThumbDownIcon sx = {{fontSize: "54px"}}/>
                        </IconButton>   

    if(isLiked){
        likeButton = <IconButton onClick = {handleLike}>
                        <ThumbUpIcon sx = {{fontSize: "54px", color: 'green'}}/>
                    </IconButton>    
    }

    if(isDisliked){
        dislikeButton = <IconButton onClick = {handleDislike}>
                            <ThumbDownIcon sx = {{fontSize: "54px", color: 'red'}}/>
                        </IconButton>   
    }


    let openedListDetails = ""
    let expandButton =  <IconButton onClick = {handleExpandMore}>
                            <ExpandMoreIcon sx = {{fontSize: "54px"}}/>
                        </IconButton>


    if(isExpanded){
        expandButton = <IconButton onClick = {handleExpandLess}>
                            <ExpandLessIcon sx = {{fontSize: "54px"}}/>
                        </IconButton>

        let commentList = 
                <Grid container>
                    <Grid item xs = {12} style = {{height: "35vh" , overflow: "scroll"}}>
                        <List sx={{ width: '90%', left: '5%'}}>
                            {
                                listInfo.comments.map((comment) => (
                                    <Box sx = {{backgroundColor: "orange", border: "2px solid black", borderRadius: "10px", marginBottom: "2%", padding: "1%"}}>
                                        <Typography sx = {{fontSize: "12pt", color: "blue", textDecoration: "underline"}}>
                                            {comment.commenterUsername}
                                        </Typography>

                                        <Typography sx = {{fontSize: "16pt"}}>
                                            {comment.content}
                                        </Typography>
                                    </Box>
                                ))
                            }
                        </List>
                    </Grid>
                    <Grid item xs = {12}>
                        <TextField 
                            sx = {{width: "100%" }}
                            onKeyPress={handleKeyPress}
                            onChange={handleUpdateComment}>

                        </TextField>
                    </Grid>
                </Grid>



        openedListDetails = <Grid container style ={{height: "42vh"}}>
                                <Grid item xs = {6}>
                                    <ListViewing items = {listInfo.items}/>
                                </Grid>

                                <Grid item xs = {6}>
                                    {commentList}
                                </Grid>
                            </Grid>
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
                            {likeButton}

                            <Typography variant = "h5">
                                {listInfo.likes}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs = {2}>

                        <div style ={{display:"flex" }}>
                            {dislikeButton} 

                            <Typography variant = "h5">
                                {listInfo.dislikes}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs = {1}>
                        {deleteIcon}
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
                        {expandButton}
                    </Grid>

                </Grid>
            </Box>
        </Box>
    )


}