import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Login from "./Pages/Login.jsx";
import UserPage from "./Pages/User.jsx"; 
import ProtectedRoute from './routing/ProtectedRoute.js';
import EnergyRequirementForm from './Pages/EnergyRequirement.jsx';
import Supplier from './Pages/Supplier.jsx'
import ProductsPage from './Pages/ProductsPage.jsx';
import UserProfile from './Pages/UserProfile.jsx';

//default theme
const theme = createTheme({
  palette: {
    background: {
      default: '#FFFFEC' 
    },
    primary: {
      main: '#90D26D', 
    },
    secondary: {
      main: '#C6A969',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    fontSize:15,
    h5:{fontFamily:'sans-serif'},
    button: {
      textTransform: 'uppercase',
    },
    
  },
  // Style overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.02)',
          },
        },
      },
    },
   
  }
 
  });

  function App() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>       
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Box component="main" flexGrow={1}>
          <Routes>
            <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
            <Route path="/User" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
            <Route path="/Supplier" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
            <Route path="/ProductsPage" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/EnergyRequirement" element={<EnergyRequirementForm/>} />
            <Route path="/UserProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          </Routes>
          </Box>
          </Box>
        </Router>
      </ThemeProvider>
    );
  }
  
  export default App;
