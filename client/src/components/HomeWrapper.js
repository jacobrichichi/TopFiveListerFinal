import { useContext } from 'react'
import NewHomeScreen from './NewHomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);

    //auth.guestDuties();
    
    if (auth.loggedIn || auth.isGuest)
        return <NewHomeScreen />
    else
        return <SplashScreen />
}