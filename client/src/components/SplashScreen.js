import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { borders } from '@mui/system';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../auth'


export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    const handleGuest = (event) => {
        console.log('component')
        auth.loginGuest();
    }

    return (
        <div id="splash-screen">
           <Box
                sx={{
                    width: "100%",
                    height: "25%",
                    backgroundColor: "rgba(87, 142, 197, 0.5)",
                    border: 1
                }}>
                    <div style = {{paddingTop: ".5%"}}>
                        <Typography variant ="h2">
                            Welcome...
                        </Typography>
                        <Typography variant ="h3">
                            to Top 5 Listing Innovation
                        </Typography>
                    </div>

            </Box>
            <div style = {{paddingTop: "1.5%"}}>
                <Typography variant = "h5" color = "common.black">
                Behind the doors of the login field, you will find that a lifetime of top 5 listing fun awaits. Just to name a few things you can do, you can: 
                </Typography>
            </div>  

            <Grid container spacing = {2} columns = {11} sx = {{height: "30%", paddingTop: "10px", width: "95%", paddingLeft: "5%"}}>
                <Grid item xs = {3}>
                    <Box 
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}>
                            <Typography variant="h5" sx= {{paddingTop: "10%",paddingLeft:"10%", width:"80%"}}>
                            Create top 5 lists of any category your heart desires. Movies, games, musicians, anything
                            </Typography>
                        </Box>
                </Grid>

                <Grid item xs = {1}>
                    <hr width="1" size="100"></hr>
                </Grid>    

                <Grid item xs = {3}>
                    <Box 
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}>
                            <Typography variant="h5" sx= {{paddingTop: "15%",paddingLeft:"10%", width:"80%"}}>
                                Vote and comment on lists with people across the globe
                            </Typography>
                        </Box>
                </Grid>

                <Grid item xs = {1}>
                    <hr width="1" size="100"></hr>      
                </Grid> 

                <Grid item xs = {3}>
                    <Box 
                        sx={{
                            width: "100%",
                            height: "100%",
                        
                        }}>
                            <Typography variant="h5" sx= {{paddingTop: "10%",paddingLeft:"10%", width:"80%"}}>
                            Find the overall rankings within categories aggregated across all users
                            </Typography>
                        </Box>
                </Grid>
            </Grid>  

             <div style = {{paddingTop: "1.5%"}}>
                <Typography variant = "h5" color = "common.black">
                    The world is yours to explore, the only question is, what will you not do?
                </Typography>

                <hr></hr>

                <Typography variant = "h5" color = "common.black">
                    Enticed? As you should. Please select either of the 3 to continue
                </Typography>
            </div>  

            <Grid container spacing = {2} sx = {{height: "30%", paddingTop: "10px", width: "95%", paddingLeft: "5%"}}>
                <Grid item xs = {4}>
                    <Link to = "/register">
                        <Button variant = "contained" sx = {{height: "40%", width: "80%"}}>
                            Create Account
                        </Button>
                    </Link>    
                </Grid>
                        
                <Grid item xs = {4}>
                    <Link to='/login'>
                        <Button variant = "contained" sx = {{height: "40%", width: "80%"}}>
                            Login
                        </Button>
                    </Link>    
                </Grid>

                <Grid item xs = {4}>
                    <Button onClick = {handleGuest} variant = "contained" sx = {{height: "40%", width: "80%"}}>
                        Continue as Guest
                    </Button>
                </Grid>
            </Grid> 
        </div>
    )
}