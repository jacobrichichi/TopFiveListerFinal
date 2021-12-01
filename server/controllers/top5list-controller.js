const Top5List = require('../models/top5list-model');
const CommunityList = require('../models/communitylist-model');
const User = require('../models/user-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    const listVals = {
        name: body.name,
        items: body.items,
        ownerEmail: body.ownerEmail,
        ownerUsername: body.ownerUserName,
        likes: 0,
        dislikes: 0,
        views: 0,
        publishDate: new Date(),
        lastEditDate: new Date(),
        isPublished: false
    }

    const top5List = new Top5List(listVals);

    if (!top5List) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    // REMEMBER THAT OUR AUTH MIDDLEWARE GAVE THE userId TO THE req
    User.findOne({ _id: req.userId }, (err, user) => {
        user.top5Lists.push(top5List._id);
        user
            .save()
            .then(() => {
                top5List
                    .save()
                    .then(() => {
                        console.log('list created successfully')
                        return res.status(201).json({
                            top5List: top5List
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Top 5 List Not Created!'
                        })
                    })
            });
    })
}
deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })
}
getTop5ListById = async (req, res) => {
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    return res.status(200).json({ success: true, top5List: list })
                }
                else {
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}

getPersonalLists = async (req, res) => {
    await User.findOne({ _id: req.userId }, (err, user) => {
        async function asyncFindList(email) {
            await Top5List.find({ ownerEmail:email }, (err, top5Lists) => {
                if(err){
                    return res.status(400).json({success: false, error: err})
                }

                if (!top5Lists) {
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let listsInfo = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        if(list.name.startsWith(req.body.keyword)){
                            let listDetails = {
                                _id: list._id,
                                name: list.name,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                views: list.views,
                                publishDate: list.publishDate,
                                ownerUsername: list.ownerUsername


                            };
                            listsInfo.push(listDetails);
                        }
                    }
                    return res.status(200).json({ success: true, listsInfo: listsInfo })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))

}

getAllLists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        else{
            let listsInfo = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                if(list.name.startsWith(req.body.keyword)){
                    let listDetails = {
                        _id: list._id,
                        name: list.name,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        views: list.views,
                        publishDate: list.publishDate,
                        ownerUsername: list.ownerUsername


                    };
                    listsInfo.push(listDetails);
                }
                }

            return res.status(200).json({ success: true, listsInfo: listsInfo })

        }
    }).catch(err => console.log(err))
}

getOtherUsersLists = async (req, res) => {

    await User.findOne({ userName: req.body.username }, (err, user) => {
        console.log(user)
        if(!user){
            console.log('no user')
            return res.status(200).json({success: true, listsInfo: []})
        }
        else {

            async function asyncFindList(email) {
                await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
                    if(err) {
                        return res.status(400).json({ success: false, error: err })
                    }
                    if(!top5Lists) {
                        return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                    }
                    else {
                        // PUT ALL THE LISTS INTO ID, NAME PAIRS
                        let listsInfo = [];
                        for (let key in top5Lists) {
                            let list = top5Lists[key];
                            let listDetails = {
                                _id: list._id,
                                name: list.name,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                views: list.views,
                                publishDate: list.publishDate,
                                ownerUsername: list.ownerUsername
    
    
                            };
                            listsInfo.push(listDetails);
                        }
                        return res.status(200).json({ success: true, listsInfo: listsInfo })
                    }

                }).catch(err => console.log(err))
            }
            asyncFindList(user.email);
        }
    }).catch(err => console.log(err))
}

getCommunityLists = async (req, res) => {
    await CommunityList.find({}, (err, communityLists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!communityLists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Community Lists not found` })
        }
        else{
            let listsInfo = [];
            for (let key in top5Lists) {
                let list = communityLists[key];
                if(list.name.startsWith(req.body.keyword)){
                    let listDetails = {
                        _id: list._id,
                        name: list.name,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        views: list.views,
                        lastEditDate: list.lastEditDate,
                    };

                    listsInfo.push(listDetails);
                }
            }
            return res.status(200).json({ success: true, listsInfo: listsInfo })

        }
    }).catch(err => console.log(err))
}


getTop5ListPairs = async (req, res) => {
    await User.findOne({ _id: req.userId }, (err, user) => {
        async function asyncFindList(email) {
            await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let listsInfo = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        let listDetails = {
                            _id: list._id,
                            name: list.name,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            views: list.views,
                            publishDate: list.publishDate,
                            ownerUsername: list.ownerUsername


                        };
                        listsInfo.push(listDetails);
                    }
                    return res.status(200).json({ success: true, listsInfo: listsInfo })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log(body)

    if (!body) {
        console.log('must provide body')
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            console.log('unfound listicle')
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }


        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    
                    console.log(body.top5List.name)
                    console.log(body.top5List.items)
                    list.name = body.top5List.name;
                    list.items = body.top5List.items;
                    list
                        .save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Top 5 List updated!',
                            })
                        })
                        .catch(error => {
                            console.log('1')
                            return res.status(404).json({
                                error,
                                message: 'Top 5 List not updated!',
                            })
                        })
                }
                else {
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(top5List);
    })
}

publishTop5List = async (req, res) => {

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {

                //List belongs to this user
                if (user._id == req.userId) {

                    //Does a published list already exist with this name by the same user
                    let dupList = Top5List.findOne({ name: list.name, ownerEmail: list.ownerEmail, isPublished: true })
                    if(dupList){
                        return res
                            .status(200)
                            .json({
                                success: false,
                                errorMessage: "Cannot have 2 lists published with the same name"
                            })
                    }

                    // If here, publishing can begin

                    list.isPublished = true
                    list.publishDate = new Date()

                    let communityList = CommunityList.findOne({name: list.name})

                    // Community list for this name already exists, just add to it
                    if(communityList){
                        for(let i = 0; i < top5List.items.length; i++){
                            for(let j = 0; j < communityList.items.length; j++){
                                if(top5List.items[i] === communityList.items[j].name){
                                    communityList.items[j].votes += 1
                                }
                            }
                        }

                        communityList.save()
                                .then(() => {
                                    list.save()
                                            .then(() => {
                                                return res.status(200).json({
                                                    success: true,
                                                    id: list._id,
                                                    message: 'Top 5 List updated!',
                                                })
                                            })
                                            .catch(error => {
                                                console.log('1')
                                                return res.status(404).json({
                                                    error,
                                                    message: 'Top 5 List not updated!',
                                                })
                                            })
                                }).catch(error => {
                                    return res.status(404).json({
                                        error,
                                        message: 'Community List not saved'
                                    })
                                })

                    }

                    // Need to create new community list
                    else{
                        let communityItems = []

                        //Initialize new community list items
                        for(let i = 0; i<list.items.length; i++){
                            communityItems.push({name: list.items[i], votes: 5 - i})
                        }

                        const comListVals = {
                            name: list.name,
                            items: communityItems,
                            likes: 0,
                            dislikes: 0,
                            views: 0,
                            lastEditDate: new Date()
                        }

                        let newComList = new CommunityList(comListVals);

                        newComList.save()
                                .then(() => {
                                    list.save()
                                            .then(() => {
                                                return res.status(200).json({
                                                    success: true,
                                                    id: list._id,
                                                    message: 'Top 5 List updated!',
                                                })
                                            })
                                            .catch(error => {
                                                console.log('1')
                                                return res.status(404).json({
                                                    error,
                                                    message: 'Top 5 List not updated!',
                                                })
                                            })
                                }).catch(error => {
                                    return res.status(404).json({
                                        error,
                                        message: 'Community List not saved'
                                    })
                                })

                    }


                }
            })
        }   
        
        asyncFindUser(top5List)

    })

}

module.exports = {
    createTop5List,
    deleteTop5List,
    getTop5ListById,
    getTop5ListPairs,
    getTop5Lists,
    updateTop5List,
    getPersonalLists,
    getAllLists,
    getOtherUsersLists,
    getCommunityLists,
    publishTop5List
}