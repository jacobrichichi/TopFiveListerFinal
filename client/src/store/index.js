import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from './store-request-api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST_FOR_EDITING: "SET_CURRENT_LIST_FOR_EDITING",
    SET_CURRENT_LIST_FOR_VIEWING: "SET_CURRENT_LIST_FOR_VIEWING",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    CLOSE_CURRENT_LIST_FOR_EDITING: "CLOSE_CURRENT_LIST_FOR_EDITING",
    CLOSE_CURRENT_LIST_FOR_VIEWING: "CLOSE_CURRENT_LIST_FOR_VIEWING",
    UPDATE_LISTSINFO: "UPDATE_LISTSINFO"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        listsInfo: [],
        listsCollectionType: 'PERSONAL',
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        searchCriteria: '',
        inWorkspace: false,
        canBePublished: false
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type)
        switch (type) {
            
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    listsInfo: payload.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: payload.top5List,
                    inWorkspace: store.inWorkspace,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: '',
                    canBePublished: store.canBePublished
                });
            }

            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST_FOR_EDITING: {
                return setStore({
                    listsInfo: store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: null,
                    inWorkspace: false,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: '',
                    canBePublished: false
                })
            }
            // STOP VIEWING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST_FOR_VIEWING: {
                return setStore({
                    listsInfo: store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: null,
                    inWorkspace: false,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: '',
                    canBePublished: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    listsInfo: store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: payload,
                    inWorkspace: true,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: '',
                    canBePublished: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    listsInfo: payload,
                    listsCollectionType: store.listsCollectionType,
                    currentList: null,
                    inWorkspace: store.inWorkspace,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: '',
                    canBePublished: store.canBePublished
                });
            }

            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    listsInfo: payload.listsInfo,
                    listsCollectionType: payload.listsCollectionType,
                    currentList: null,
                    inWorkspace: store.inWorkspace,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: payload.searchCriteria,
                    canBePublished: false
                })
            }

            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    listsInfo : store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: null,
                    inWorkspace: false,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    searchCriteria: store.searchCriteria,
                    canBePublished: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    listsInfo : store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: null,
                    inWorkspace: false,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    canBePublished: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST_FOR_EDITING: {
                return setStore({
                    listsInfo: store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: payload.currentList,
                    inWorkspace: true,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    canBePublished: payload.canBePublished
                });
            }

            case GlobalStoreActionType.SET_CURRENT_LIST_FOR_VIEWING: {
                return setStore({
                    listsInfo: store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: payload,
                    inWorkspace: false,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    searchCriteria: store.searchCriteria,
                    canBePublished: false
                });
            }

            // START EDITING A LIST ITEM
            
            //UPDATE LIST THAT IS NOT CURRENTLIST
            case GlobalStoreActionType.UPDATE_LISTSINFO: {
                return setStore({
                    listsInfo: payload,
                    listsCollectionType: store.listsCollectionType,
                    currentList: store.currentList,
                    inWorkspace: store.inWorkspace,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: store.isItemEditActive,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    searchCriteria: store.searchCriteria,
                    canBePublished: store.canBePublished
                });
            }
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    listsInfo: store.listsInfo,
                    listsCollectionType: store.listsCollectionType,
                    currentList: store.currentList,
                    inWorkspace: store.inWorkspace,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: payload.isItemEditActive,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    searchCriteria: store.searchCriteria,
                    canBePublished: payload.canBePublished
                });
            }



            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.status === 200) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST_FOR_EDITING,
                        payload: {
                            currentList: top5List
                        }
                    });
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeEditingList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST_FOR_EDITING,
            payload: {}
        });
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        console.log(auth.user.userName)
        const response = await api.createTop5List(newListName, ["?", "?", "?", "?", "?"], auth.user.email, auth.user.userName);

        if (response.status === 201) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.saveList = async function(name) {
        let response = await api.getTop5ListById(store.currentList._id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            top5List.name = name
            top5List.items = store.currentList.items
            top5List.lastEditDate = new Date()
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.status === 200) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST_FOR_EDITING,
                        payload: {
                            currentList: top5List
                        }
                    });

                }
            }
            updateList(top5List);
        }
    }

    store.publishList = async function(title) {
        // First simulate the event that the user saved the list before publishing in case they did not
        store.saveList(title);

        console.log(store.currentList._id)
        let response = await api.publishTop5ListById(store.currentList._id)




    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        console.log("store.loadIdNamePairs");
        const response = await api.getTop5ListPairs();
        if (response.status === 200) {
            let listsInfo = response.data.listsInfo;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: listsInfo
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.getPersonalLists = async function(keyword){
        const response = await api.getPersonalLists(keyword);
        if (response.status === 200) {
            let listsInfo = response.data.listsInfo;

            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: {
                    listsInfo: listsInfo,
                    listsCollectionType: "PERSONAL",
                    searchCriteria: keyword
                }

            })
        }
    }

    store.getAllLists = async function(keyword){
        const response = await api.getAllLists(keyword);
        if (response.status === 200) {
            let listsInfo = response.data.listsInfo;

            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: {
                    listsInfo: listsInfo,
                    listsCollectionType: "ALL_LISTS",
                    searchCriteria: keyword
                }

            })
        }
    }

    store.getOtherUsersLists = async function(username){
        const response = await api.getOtherUsersLists(username);
        if (response.status === 200) {
            let listsInfo = response.data.listsInfo;

            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: {
                    listsInfo: listsInfo,
                    listsCollectionType: "OTHER_USER",
                    searchCriteria: username
                }

            })
        }
    }

    store.getCommunityLists =  async function(keyword){
        const response = await api.getCommunityLists(keyword);
        if(response.status === 200){
            let listsInfo = response.data.listsInfo

            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: {
                    listsInfo: listsInfo,
                    listsCollectionType: "COMMUNITY",
                    searchCriteria: keyword
                }
            })
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.status === 200) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentListForEditing = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.status === 200) {
                let canBePublished = store.canBePublishedCheck(top5List)
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST_FOR_EDITING,
                    payload: {currentList: top5List, canBePublished: canBePublished}
                });
               // history.push("/top5list/" + top5List._id);
            }
        }
    }

    store.openListForEditing = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            let canBePublished = store.canBePublishedCheck(top5List)
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST_FOR_EDITING,
                payload: {currentList: top5List, canBePublished: canBePublished}
            });
            history.push("/top5list/" + top5List._id);
            
        }
    }

    store.canBePublishedCheck = function(list) {
        for(let i = 0; i<list.items.length; i++){
            if(list.items[i].length==0 || list.items[i] === "?"){
                return false
            }
        }
        return true
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        let canBePublished = store.canBePublishedCheck(store.currentList)
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST_FOR_EDITING,
            payload: {currentList: store.currentList, canBePublished: canBePublished}
        });
        
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function (editActive) {
        let canBePublished = store.canBePublishedCheck(store.currentList)
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: { isItemEditActive: editActive, canBePublished: canBePublished }
        });
    }

    store.addNewComment = async function(comment, listInfo){

        let response = {}

        if(store.listsCollectionType === 'COMMUNITY'){
            response = await api.addNewCommunityComment(comment, listInfo._id)
        }

        else{
            response = await api.addNewComment(comment, listInfo._id)
        }

        if(response.status === 200){
            const comment = response.data.comment

            let listsInfo = store.listsInfo

            for(let i = 0; i<listsInfo.length; i++){
                if(listsInfo[i]._id === listInfo._id){
                    listsInfo[i].comments.push(comment)
                    break;
                }
            }


            storeReducer({
                type: GlobalStoreActionType.UPDATE_LISTSINFO,
                payload: listsInfo
            })

        }
    }

    store.expandList = async function(listId) {
        let response = {}

        if(store.listsCollectionType === 'COMMUNITY'){
            response = await api.getCommunityListRefs(listId)
            if(response.status === 200){
                let listsInfo = store.listsInfo

                for(let i = 0; i<listsInfo.length; i++){
                    if(listsInfo[i]._id === listId){
                        listsInfo[i].comments = response.data.comments
                        listsInfo[i].items = response.data.items
                        break
                    }
                }

                storeReducer({
                    type: GlobalStoreActionType.UPDATE_LISTSINFO,
                    payload: listsInfo
                })

            }

        }

        else{
            response = await api.getComments(listId)


            if(response.status === 200){
                let listsInfo = store.listsInfo

                for(let i = 0; i<listsInfo.length; i++){
                    if(listsInfo[i]._id === listId){
                        listsInfo[i].comments = response.data.comments
                        break
                    }
                }

                storeReducer({
                    type: GlobalStoreActionType.UPDATE_LISTSINFO,
                    payload: listsInfo
                })
            }
        }
    }

    store.likeList = async function(listId) {
        let response = {}

        if(store.listsCollectionType==='COMMUNITY'){
            response = await api.addOrRemoveLikeCommunity(listId)
        }

        else{
            response = await api.addOrRemoveLike(listId)
        }

        if(response.status === 200){
            let listsInfo = store.listsInfo
            if(response.data.added){
                for(let i = 0; i<listsInfo.length; i++){
                    if(listsInfo[i]._id == listId){
                        listsInfo[i].likes += 1
                        listsInfo[i].liked = true
                        break
                    }
                }
            }

            else{
                for(let i = 0; i<listsInfo.length; i++){
                    if(listsInfo[i]._id == listId){
                        listsInfo[i].likes -= 1
                        listsInfo[i].liked = false
                        break
                    }
                }
            }

            storeReducer({
                type: GlobalStoreActionType.UPDATE_LISTSINFO,
                payload: listsInfo
            })
        }
    }

    store.dislikeList = async function(listId) {
        let response = {}

        if(store.listsCollectionType==='COMMUNITY'){
            response = await api.addOrRemoveDislikeCommunity(listId)
        }

        else{
            response = await api.addOrRemoveDislike(listId)
        }

        if(response.status === 200){
            let listsInfo = store.listsInfo
            if(response.data.added){
                for(let i = 0; i<listsInfo.length; i++){
                    if(listsInfo[i]._id == listId){
                        listsInfo[i].dislikes += 1
                        listsInfo[i].disliked = true
                        break
                    }
                }
            }

            else{
                for(let i = 0; i<listsInfo.length; i++){
                    if(listsInfo[i]._id == listId){
                        listsInfo[i].dislikes -= 1
                        listsInfo[i].disliked = false
                        break
                    }
                }
            }

            storeReducer({
                type: GlobalStoreActionType.UPDATE_LISTSINFO,
                payload: listsInfo
            })
        }
    }

    store.sortByDateOldest = function(){
        let listsInfo = store.listsInfo
        listsInfo.sort((a, b) => (a.publishDate < b.publishDate) ? 1 : -1)

        storeReducer({
            type: GlobalStoreActionType.UPDATE_LISTSINFO,
            payload: listsInfo
        })
    }

    store.sortByDateNewest = function(){
        let listsInfo = store.listsInfo
        listsInfo.sort((a, b) => (a.publishDate > b.publishDate) ? 1 : -1)

        storeReducer({
            type: GlobalStoreActionType.UPDATE_LISTSINFO,
            payload: listsInfo
        })
    }

    store.sortByViews = function() {
        let listsInfo = store.listsInfo
        listsInfo.sort((a, b) => (a.views < b.views) ? 1 : -1)

        storeReducer({
            type: GlobalStoreActionType.UPDATE_LISTSINFO,
            payload: listsInfo
        })
    }

    store.sortByLikes = function() {
        let listsInfo = store.listsInfo
        listsInfo.sort((a, b) => (a.likes < b.likes) ? 1 : -1)

        storeReducer({
            type: GlobalStoreActionType.UPDATE_LISTSINFO,
            payload: listsInfo
        })
    }

    store.sortByDislikes = function() {
        let listsInfo = store.listsInfo
        listsInfo.sort((a, b) => (a.dislikes < b.dislikes) ? 1 : -1)

        storeReducer({
            type: GlobalStoreActionType.UPDATE_LISTSINFO,
            payload: listsInfo
        })
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };