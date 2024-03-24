import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import Navbar from '../shared/Navbar';
import { wrapper } from '../../store/store'; // Ensure correct import path
import { parseCookies } from 'nookies'; // For handling cookies
import jwt from 'jsonwebtoken'; // For verifying JWT token
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Dashboard = ({ firstName, watchLists }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser({ firstName, watchLists }));
  }, [firstName, watchLists, dispatch]);
  
  console.log('firstName: ', firstName);
  console.log('watchLists: ', watchLists);
  
  return (
    
    <Container maxWidth="xl" sx={{ mt: 8, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" component="h3">
          Welcome, {firstName}!
        </Typography>
        {/* Section 1 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">Section 1</Typography>
          {/* Content for Section 1 */}
        </Box>
        {/* Section 2 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">Section 2</Typography>
          {/* Content for Section 2 */}
        </Box>
      </Box>
    </Container>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.FlickQueueAuth;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assuming the token contains firstName and watchLists, you can directly pass them to props
    return {
      props: {
        firstName: decoded.firstName || 'Guest',
        watchLists: decoded.watchLists || [], // Adjust according to the actual structure of your token
      },
    };
  } catch (err) {
    // If token verification fails, redirect to login
    return {
      redirect: {
        destination: '/login', // Ensure this is your login route
        permanent: false,
      },
    };
  }
});

export default Dashboard;
