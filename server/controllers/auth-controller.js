const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}


loginUserById = async (req, res) => {
    console.log(req.userId)
    await User.findOne({ _id: req.userId }, (err, existingUser) => {
        return res.status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                userName: existingUser.userName,
                email: existingUser.email              
            }
        })
    })
}


loginUser = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        console.log(email)

        if (!email || !password) {
            return res
                .status(200)
                .json({ success: false, errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(200)
                .json({
                    success: false,
                    errorMessage: "Wrong email or password provided."
                })
        }
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(200)
                .json({
                    success: false,
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);

        console.log(token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                userName: existingUser.userName,
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

/*guestStartUp = async (req, res) => {
    User.findOne({ userName: "Guest"}, (err, guest) => {
        //initial DB start up, need to create a guest account
        if(!guest){
            let newGuestVals =  { firstName: "Guest", lastName: "Guest", userName: "Guest", email: "guest@guest.guest", passwordHash: "password"}
            let newGuest = new User(newGuestVals)
            newGuest.save()
        }

    })
}*/

loginGuest = async (req, res) => {

    //Sign token with the guest account

    User.findOne({ email: "guest@guest.guest" }, (err, guest) => {
        let token = {};
        if(!guest){
            let newGuestVals =  { firstName: "Guest", lastName: "Guest", userName: "Guest", email: "guest@guest.guest", passwordHash: "password"}
            let newGuest = new User(newGuestVals)
            newGuest.save()
            token = auth.signToken(newGuest)
        }
        else{
            token = auth.signToken(guest)
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName:'Guest',
                lastName: 'Guest',  
                userName: "Guest",
                email: 'guest@guest.guest'              
            }
        })
    })
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        let { firstName, lastName, userName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !userName || !email || !password || !passwordVerify) {
            return res
                .status(200)
                .json({ success: false, errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(200)
                .json({
                    success: false,
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(200)
                .json({
                    success: false,
                    errorMessage: "Please enter the same password twice."
                })
        }
        let existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res
                .status(200)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        existingUser = await User.findOne({ userName: userName.toLowerCase() });
        if (existingUser) {
            return res
                .status(200)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        userName = userName.toLowerCase()
        email = email.toLowerCase()

        const newUser = new User({
            firstName, lastName, userName, email, passwordHash
        });
        const savedUser = await newUser.save();

        return res.status(200).json({
            success: true
        })

        // LOGIN THE USER
       /* const token = auth.signToken(savedUser._id);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,  
                userName: savedUser.userName,
                email: savedUser.email              
            }
        })*/

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    loginUserById,
    logoutUser,
    loginGuest
}