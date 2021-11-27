import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_GUEST: "LOGIN_GUEST",
    ADD_WRONG_CREDENTIALS: "ADD_WRONG_CREDENTIALS",
    REMOVE_WRONG_CREDENTIALS: "REMOVE_WRONG_CREDENTIALS" 
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isGuest: false,
        wrongCredentials: null,
        isWrongCredentials: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    isGuest: auth.isGuest,
                    wrongCredentials: null,
                    isWrongCredentials: false
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isGuest: false,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: false,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isGuest: false,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }
            case AuthActionType.LOGIN_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: true,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }

            case AuthActionType.ADD_WRONG_CREDENTIALS: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: false,
                    wrongCredentials: payload.message,
                    isWrongCredentials: true
                })
            }

            case AuthActionType.REMOVE_WRONG_CREDENTIALS: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: false,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }

            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, userName, email, password, passwordVerify) {
        const response = await api.registerUser(firstName, lastName, userName, email, password, passwordVerify);      
        if (response.status === 200) {
            if(response.data.success){
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/login");
            }
            else {
                authReducer({
                    type: AuthActionType.ADD_WRONG_CREDENTIALS,
                    payload: {
                        message: response.data.errorMessage
                    }
                })
            }
        }
    }

    auth.loginUser = async function(email, password) {
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            if(response.data.success){
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
            else {
                authReducer({
                    type: AuthActionType.ADD_WRONG_CREDENTIALS,
                    payload: {
                        message: response.data.errorMessage
                    }
                })
            }
        }
    }

    auth.closeErrorMessage = async function(store) {
        authReducer({
            type: AuthActionType.REMOVE_WRONG_CREDENTIALS,
            payload: {

            }
        })
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.loginGuest = async function() {
        console.log('auth.index')
        const response = await api.loginGuest();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_GUEST,
                payload: {
                }
            })
            history.push("/");
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };