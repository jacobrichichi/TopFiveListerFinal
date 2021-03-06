/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (newListName, newItems, userEmail, userName) => {
    return api.post(`/top5list/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        items: newItems,
        ownerEmail: userEmail,
        ownerUserName: userName
    })
}
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)
export const getTop5ListPairs = () => api.get(`/top5listpairs/`)

export const getPersonalLists = (keyword) => { return api.post('/personaltop5lists/', {keyword: keyword}) }
export const getAllLists = (keyword) => { return api.post('/allLists/', {keyword: keyword}) }
export const getOtherUsersLists = (username) => { return api.post('/otheruserslists', { username: username }) }
export const getCommunityLists = (keyword) => { return api.post('/communitylists/', {keyword: keyword}) }

export const updateTop5ListById = (id, top5List) => {
    return api.put(`/top5list/${id}`, {
        // SPECIFY THE PAYLOAD
        top5List : top5List
    })
}

export const publishTop5ListById = (id) => {
    return api.post(`/publishTop5list/${id}`)
}

export const addNewComment = (comment, id) => {
    return api.post(`/addcomment/${id}`, {content: comment})
}

export const addNewCommunityComment = (comment, id) => {
    return api.post(`/addcommunitycomment/${id}`, {content: comment})
}

export const getComments = (id) => {
    return api.post(`/getcomments/${id}`)
}

export const getCommunityListRefs = (id) => {
    return api.post(`/getCommunityListRefs/${id}`)
}

export const addOrRemoveLike = (id) => {
    return api.post(`/addOrRemoveLike/${id}`)
}

export const addOrRemoveDislike = (id) => {
    return api.post(`/addOrRemoveDislike/${id}`)
}

export const addOrRemoveLikeCommunity = (id) => {
    return api.post(`/addOrRemoveLikeCommunity/${id}`)
}

export const addOrRemoveDislikeCommunity = (id) => {
    return api.post(`/addOrRemoveDislikeCommunity/${id}`)
}

const apis = {
    createTop5List,
    deleteTop5ListById,
    getTop5ListById,
    getTop5ListPairs,
    updateTop5ListById,
    getPersonalLists,
    getAllLists,
    getOtherUsersLists,
    getCommunityLists,
    publishTop5ListById,
    addNewComment,
    addNewCommunityComment,
    getComments,
    getCommunityListRefs,
    addOrRemoveLike,
    addOrRemoveDislike,
    addOrRemoveLikeCommunity,
    addOrRemoveDislikeCommunity
}

export default apis
