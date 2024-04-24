import React, { useContext } from 'react';
import { Grid, Box, Toolbar } from '@mui/material';
import CustomAppBar from '../components/AppBar.jsx';
import SideBar from '../components/Sidebar.jsx';
import Section from '../components/Section.jsx';
import { AuthContext } from '../context/AuthContext.js';
import { useAuth } from '../context/AuthContext.js';
import UserEnergyConfig from "../components/EnergyConfig.jsx"
import GetSystemRecommendations from '../components/SystemRecommendations.jsx';
import CostingChart from '../components/CostingChart.jsx';

const UserPage = () => {
    const { currentUser } = useContext(AuthContext);
    const drawerItems = [
        { label: 'Home', path: '/User', icon: 'Home' },
        { label: 'Profile', path: '/UserProfile', icon: 'Profile' },
        { label: 'Products', path: '/ProductsPage', icon: 'Products' },
        
    ];
    const { logout } = useAuth();
    return (
    <Box sx={{ display: 'flex' }}>
        <CustomAppBar title="User Dashboard" logout={logout} />
        <SideBar items={drawerItems} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Grid container spacing={3}>
            <Grid item xs={12}>
                <Section title={`Welcome ${currentUser?.firstname || 'User'}`}>
                {/* Welcome section content */}
                </Section>
            </Grid>
            <Grid container item xs={12} spacing={3}>
                {/* Energy Usage Section */}
                <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <Box sx={{ flexGrow: 1, minHeight: 331, bgcolor: '#F1E4C3', p: 2, display: 'flex', flexDirection: 'column', borderRadius:'5%' }}>
                <UserEnergyConfig title="Current Configuration" />
                </Box>
                </Grid>
                {/* Recommendations Section */}
                <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                <Box sx={{ flexGrow: 1, minHeight: 331, bgcolor: '#F1E4C3', p: 2, display: 'flex', flexDirection: 'column', borderRadius:'5%' }}>             
                    <GetSystemRecommendations />
               </Box>
                </Grid>
            </Grid>
            {/* Cost Comparison Chart */}
            <Grid item xs={12} sx={{bgcolor:'#F1E4C3',alignContent:'center',p: 2,marginLeft:3, marginTop:2, borderRadius:'3%'}} >
                
                <Box sx={{ display: 'flex', justifyContent: 'center',bgcolor: 'whiteSmoke',minHeight: 400, borderRadius:'3%'}}>
                <CostingChart />
                </Box>
                
               
            </Grid>
            </Grid>
        </Box>
        </Box>

    );
}

export default UserPage;
