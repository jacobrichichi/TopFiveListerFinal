const Top5List = require('../models/top5list-model');
const CommunityList = require('../models/communitylist-model');
const User = require('../models/user-model');
const Comment = require('../models/comment-model');
const CommunityItem = require('../models/communityitem-model')

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
                            let liked = false
                            let disliked = false
                            if(user.likes.includes(list._id)){
                                liked = true
                            }
                            if(user.dislikes.includes(list._id)){
                                disliked = true
                            }
                            
                            let comment = [{commenterUsername: '', content: ''}]
                            let listDetails = {
                                _id: list._id,
                                name: list.name,
                                items: list.items,
                                comments: comment,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                views: list.views,
                                publishDate: list.publishDate,
                                ownerUsername: list.ownerUsername,
                                isPublished: list.isPublished,
                                liked: liked,
                                disliked: disliked
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
    await User.findOne({ _id: req.userId }, (err, user) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'user not found'
            })
        }
        async function asyncFindLists(user){

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
                            let comment = [{commenterUsername: '', content: ''}]

                            let liked = false
                            let disliked = false
                            if(user.likes.includes(list._id)){
                                liked = true
                            }
                            if(user.dislikes.includes(list._id)){
                                disliked = true
                            }

                            let listDetails = {
                                _id: list._id,
                                name: list.name,
                                items: list.items,
                                comments: comment,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                views: list.views,
                                publishDate: list.publishDate,
                                ownerUsername: list.ownerUsername,
                                isPublished: list.isPublished,
                                liked: liked,
                                disliked: disliked


                            };
                            listsInfo.push(listDetails);
                        }
                        }

                    return res.status(200).json({ success: true, listsInfo: listsInfo })

                }
            }).catch(err => console.log(err))
        }
        asyncFindLists(user)
    })
}

getOtherUsersLists = async (req, res) => {
    await User.findOne({ _id: req.userId }, (err, callingUser) => {

        if(err){
            return res.status(404).json({
                err,
                message: 'calling user invalid'
            })
        }

        async function asyncFindOtherUser(username, callingUser){

            await User.findOne({ userName: username }, (err, otherUser) => {
                if(!otherUser){
                    console.log('no user')
                    return res.status(200).json({success: true, listsInfo: []})
                }
                else {

                    async function asyncFindList(email, callingUser) {
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
                                    let comment = [{commenterUsername: '', content: ''}]

                                    let liked = false
                                    let disliked = false
                                    if(callingUser.likes.includes(list._id)){
                                        liked = true
                                    }
                                    if(callingUser.dislikes.includes(list._id)){
                                        disliked = true
                                    }

                                    let listDetails = {
                                        _id: list._id,
                                        name: list.name,
                                        items: list.items,
                                        comments: comment,
                                        likes: list.likes,
                                        dislikes: list.dislikes,
                                        views: list.views,
                                        publishDate: list.publishDate,
                                        ownerUsername: list.ownerUsername,
                                        isPublished: list.isPublished,
                                        liked: liked,
                                        disliked: disliked
            
            
                                    };
                                    listsInfo.push(listDetails);
                                }
                                return res.status(200).json({ success: true, listsInfo: listsInfo })
                            }

                        }).catch(err => console.log(err))
                    }
                    asyncFindList(otherUser.email, callingUser);
                }
            }).catch(err => console.log(err))
        }
        asyncFindOtherUser(req.body.username, callingUser)
    })
}

getCommunityLists = async (req, res) => {
    await User.findOne({ _id: req.userId }, (err, user) => {
        async function asyncFindComLists(user){
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
                    for (let key in communityLists) {
                        let list = communityLists[key];
                        if(list.name.startsWith(req.body.keyword)){
                            let comment = [{commenterUsername: '', content: ''}]
                            let item = [{item: '', votes: 0}, {item: '', votes: 0},{item: '', votes: 0},{item: '', votes: 0},{item: '', votes: 0}]
                            
                            let liked = false
                            let disliked = false
                            if(user.likes.includes(list._id)){
                                liked = true
                            }
                            if(user.dislikes.includes(list._id)){
                                disliked = true
                            }
                        
                            let listDetails = {
                                _id: list._id,
                                name: list.name,
                                items: item,
                                comments: comment,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                views: list.views,
                                lastEditDate: list.lastEditDate,
                                liked: liked,
                                disliked: disliked
                            };

                            listsInfo.push(listDetails);
                        }
                    }
                    return res.status(200).json({ success: true, listsInfo: listsInfo })

                }
            }).catch(err => console.log(err))
        }
        asyncFindComLists(user)
    })
}


getTop5ListPairs = async (req, res) => {
    await User.findOne({ _id: req.userId}, (err, user) =>{
        if(err){
            return res.status(404).json({
                err,
                message: "user not found"
            })
        }

        async function asyncFindList(user) {
            await Top5List.find({ ownerEmail: user.email }, (err, top5Lists) => {
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
                        let comment = [{commenterUsername: '', content: ''}]

                        let liked = false
                        let disliked = false
                        if(user.likes.includes(list._id)){
                            liked = true
                        }
                        if(user.dislikes.includes(list._id)){
                            disliked = true
                        }

                        let listDetails = {
                            _id: list._id,
                            name: list.name,
                            items: list.items,
                            comments: comment,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            views: list.views,
                            publishDate: list.publishDate,
                            ownerUsername: list.ownerUsername,
                            isPublished: list.isPublished,
                            liked: liked,
                            disliked: disliked

                        };
                        listsInfo.push(listDetails);
                    }
                    return res.status(200).json({ success: true, listsInfo: listsInfo })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user);
    })

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
        console.log('found')

        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {

                //List belongs to this user
                if (user._id == req.userId) {
                    console.log('belongs to user')

                    //Does a published list already exist with this name by the same user
                    Top5List.findOne({ name: list.name, ownerEmail: list.ownerEmail, isPublished: true }, (err, dupList) => {
                        
                        
                        if(dupList != null){
                            
                            return res
                                .status(200)
                                .json({
                                    success: false,
                                    errorMessage: "Cannot have 2 lists published with the same name"
                                })
                        }

                        console.log('no dup list')
                        // If here, publishing can begin

                        list.isPublished = true
                        list.publishDate = new Date()

                        CommunityList.findOne({name: list.name}, (err, communityList) => {

                            // Community list for this name already exists, just add to it
                            if(communityList != null){
                                for(let i = 0; i < communityList.items.length; i++){
                                    let comItem = CommunityList.findOne({_id: communityList.items[i]})

                                    for(let j = 0; j < top5List.items.length; j++){
                                        if(top5List.items[i] === comItem.item){
                                            comItem.votes += 1
                                        }
                                    }

                                    comItem.save()
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
                                console.log('create com')
                                let communityItems = []

                                //Initialize new community list items
                                for(let i = 0; i<list.items.length; i++){
                                    let itemVals = { item: list.items[i], votes: 5-i}
                                    let comItem = new CommunityItem(itemVals)

                                    comItem.save()
                                    communityItems.push(comItem)
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
                        })
                    })

                }
            })
        }   
        
        asyncFindUser(top5List)

    })

}

addNewComment = async (req, res) => {
    Top5List.findOne({_id: req.params.id}, (err, top5List) => {
        if(err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        console.log('found')
        console.log(top5List)

        async function asyncFindUser(list) {
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(err){
                    return res.status(404).json({
                        err,
                        message: 'User not found'
                    })
                }

                const username = user.userName
                
                const commentVals = {
                    commenterUsername: username,
                    content: req.body.content
                }

                const comment = new Comment(commentVals)
                console.log(comment)

                list.comments.push(comment)
                console.log(list.comments)

                comment.save()
                    .then(() => {
                        list.save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Top 5 List updated!',
                                comment: comment
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
                    message: 'Comment not saved'
                })
            })

            })
        }

        asyncFindUser(top5List)


    })
}

addNewCommunityComment = async (req, res) => {
    CommunityList.findOne({_id: req.params.id}, (err, communityList) => {
        if(err) {
            return res.status(404).json({
                err,
                message: 'Community List not found!',
            })
        }

        console.log('found')
        console.log(communityList)

        async function asyncFindUser(list) {
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(err){
                    return res.status(404).json({
                        err,
                        message: 'User not found'
                    })
                }

                console.log('found user')
                console.log(user)

                const username = user.userName
                
                const commentVals = {
                    commenterUsername: username,
                    content: req.body.content
                }

                const comment = new Comment(commentVals)

                list.comments.push(comment)

                comment.save()
                    .then(() => {
                        list.save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Community List updated!',
                                comment: comment
                            })
                        })
                        .catch(error => {
                            console.log('1')
                            return res.status(404).json({
                                error,
                                message: 'Community List not updated!',
                            })
                        })
            }).catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Comment not saved'
                })
            })

            })
        }

        asyncFindUser(communityList)


    })
}

getComments = async (req, res) => {
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        if(err){
            return res.status(404).json({
                err,
                message: "Top5List not found"
            })
        }

        async function asyncGetComments(list){
            let commentsContents = []
            let oneContent = {}

            for(let i = 0; i<list.comments.length; i++){
                oneContent = await Comment.findOne({ _id: list.comments[i] })
                commentsContents.push({ commenterUsername: oneContent.commenterUsername, content: oneContent.content })
            }

            return res.status(200).json({ comments: commentsContents })
        }
        asyncGetComments(top5List)
    })
}

getCommunityListRefs = async (req, res) => {
    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        if(err){
            return res.status(404).json({
                err,
                message: "CommunityList not found"
            })
        }
        console.log(communityList)

        async function asyncGetComments(list){
            let commentsContents = []
            let oneContent = {}

            for(let i = 0; i<list.comments.length; i++){
                oneContent = await Comment.findOne({ _id: list.comments[i] })
                commentsContents.push({ commenterUsername: oneContent.commenterUsername, content: oneContent.content })
            }

            async function asyncGetItems(list){
                let items = []
                let oneItem = {}
                
                for(let i = 0; i<5; i++){
                    oneItem = await CommunityItem.findOne({ _id: list.items[i]})
                    items.push({ item: oneItem.item, votes: oneItem.votes })
                }

                return res.status(200).json({ comments: commentsContents, items: items })
            }
            asyncGetItems(list)

        }
        asyncGetComments(communityList)
    })
}

addOrRemoveLike = async (req, res) => {
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Top 5 list unfound'
            })
        }

        async function asyncFindUser(list){
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(err){
                    return res.status(404).json({
                        err,
                        message: 'user unfound'
                    })
                }

                let added = true

                // Remove the like
                if(user.likes.includes(list._id)){
                    let index = user.likes.indexOf(list._id)
                    user.likes.splice(index, 1)
                    added = false
                    list.likes -= 1
                }

                // Add the like
                else{
                    user.likes.push(list._id)
                    list.likes += 1
                }

                user.save()
                    .then(() => {
                        list.save()
                            .then(() => {
                                return res.status(200).json({
                                    added: added,
                                    message: 'List liked successfully'
                                })
                            })
                            .catch(error => {
                                return res.status(400).json({
                                    errorMessage: 'Top 5 List Not updated!'
                                })
                            })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'User not updated!'
                        })
                    })


            })
        }
        asyncFindUser(top5List)
    })
}

addOrRemoveDislike = async (req, res) => {
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Top 5 list unfound'
            })
        }

        async function asyncFindUser(list){
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(err){
                    return res.status(404).json({
                        err,
                        message: 'user unfound'
                    })
                }

                let added = true

                // Remove the like
                if(user.dislikes.includes(list._id)){
                    let index = user.dislikes.indexOf(list._id)
                    user.dislikes.splice(index, 1)
                    added = false
                    list.dislikes -= 1
                }

                // Add the like
                else{
                    user.dislikes.push(list._id)
                    list.dislikes += 1
                }

                user.save()
                    .then(() => {
                        list.save()
                            .then(() => {
                                return res.status(200).json({
                                    added: added,
                                    message: 'List liked successfully'
                                })
                            })
                            .catch(error => {
                                return res.status(400).json({
                                    errorMessage: 'Top 5 List Not updated!'
                                })
                            })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'User not updated!'
                        })
                    })


            })
        }
        asyncFindUser(top5List)
    })
}

addOrRemoveLikeCommunity = async (req, res) => {
    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Top 5 list unfound'
            })
        }

        async function asyncFindUser(list){
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(err){
                    return res.status(404).json({
                        err,
                        message: 'user unfound'
                    })
                }

                let added = true

                // Remove the like
                if(user.likes.includes(list._id)){
                    let index = user.likes.indexOf(list._id)
                    user.likes.splice(index, 1)
                    added = false
                    list.likes -= 1
                }

                // Add the like
                else{
                    user.likes.push(list._id)
                    list.likes += 1
                }

                user.save()
                    .then(() => {
                        list.save()
                            .then(() => {
                                return res.status(200).json({
                                    added: added,
                                    message: 'List liked successfully'
                                })
                            })
                            .catch(error => {
                                return res.status(400).json({
                                    errorMessage: 'Top 5 List Not updated!'
                                })
                            })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'User not updated!'
                        })
                    })


            })
        }
        asyncFindUser(communityList)
    })
}

addOrRemoveDislikeCommunity = async (req, res) => {
    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Top 5 list unfound'
            })
        }

        async function asyncFindUser(list){
            await User.findOne({ _id: req.userId }, (err, user) => {
                if(err){
                    return res.status(404).json({
                        err,
                        message: 'user unfound'
                    })
                }

                let added = true

                // Remove the like
                if(user.dislikes.includes(list._id)){
                    let index = user.dislikes.indexOf(list._id)
                    user.dislikes.splice(index, 1)
                    added = false
                    list.dislikes -= 1
                }

                // Add the like
                else{
                    user.dislikes.push(list._id)
                    list.dislikes += 1
                }

                user.save()
                    .then(() => {
                        list.save()
                            .then(() => {
                                return res.status(200).json({
                                    added: added,
                                    message: 'List liked successfully'
                                })
                            })
                            .catch(error => {
                                return res.status(400).json({
                                    errorMessage: 'Top 5 List Not updated!'
                                })
                            })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'User not updated!'
                        })
                    })


            })
        }
        asyncFindUser(communityList)
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
    publishTop5List,
    addNewComment,
    addNewCommunityComment,
    getComments,
    getCommunityListRefs,
    addOrRemoveLike,
    addOrRemoveDislike,
    addOrRemoveLikeCommunity,
    addOrRemoveDislikeCommunity,
}