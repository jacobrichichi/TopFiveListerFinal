import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState(props.text);

    function handleKeyPress(event) {
        if (event.code === "Enter") {

            let index = event.target.id.substring("list-".length);
            let text = event.target.value;
            store.updateItem(index-1, text)
            store.setIsItemEditActive(false);
            setEditActive(false);
        }
    }

    function handleDoubleClick(event) {
        if(!store.isItemEditActive){
            console.log(store.canBePublished)
            store.setIsItemEditActive(true);
            setEditActive(true)
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let { index } = props;

    let itemClass = "top5-item";

    let itemBoxContents =   <Box 
                                sx = 
                                {{borderRadius: "10px",
                                backgroundColor: "#bfa739", 
                                width: "100%",
                                marginLeft: "20px",
                                padding: "10px"
                                }}
                                onDoubleClick = {handleDoubleClick}>
                                    {props.text}
                            </Box>

    if (editActive) {
        itemBoxContents = 
            <TextField
                required
                fullWidth
                id={"item-" + (index+1)}
                name="item"
                autoComplete="Top 5 List Item"
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
                inputProps={{style: {fontSize: 39}}}
                autoFocus
                size = "small"
                sx = {{height: "8vh", borderRadius: "10px", backgroundColor: "white", marginLeft: '1.5%'}}
            />
    }
    return (
        <ListItem
                id={'item-' + (index+1)}
                className={itemClass}
                sx={{ p: 1, margin: "0px", height: "10%", width: "98%" }}
                style={{ width: '100%' }}
                style={{
                    fontSize: '39pt'
                }}
            >
                <Box sx={{ borderRadius: "10px", backgroundColor: "#bfa739"}}>
                    <Typography variant="h3" sx = {{padding: "10px"}}>
                        {index + 1}.
                    </Typography>
                </Box>

                {itemBoxContents}

            </ListItem>
    );
}

export default Top5Item;