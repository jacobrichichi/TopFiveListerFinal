import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import NewHomeScreen from './NewHomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);

  //  const userId = localStorage.getItem("userId");

   // if(userId){
  //      auth.loginUserById()
  //  }
    
    if (auth.loggedIn || auth.isGuest)
        return <NewHomeScreen />
    else
        return <SplashScreen />
}