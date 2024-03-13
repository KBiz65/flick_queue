import React from 'react';
import { wrapper } from '../../store/store'; // Ensure correct import path
import { parseCookies } from 'nookies'; // For handling cookies
import jwt from 'jsonwebtoken'; // For verifying JWT token

const Dashboard = ({ firstName, watchLists }) => {
  console.log('firstName: ', firstName);
  console.log('watchLists: ', watchLists);
  
  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Welcome, {firstName}!</h3>
      {/* You can map over watchLists here to render them */}
    </div>
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
