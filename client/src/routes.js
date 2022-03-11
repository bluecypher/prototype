import { Navigate, useRoutes } from 'react-router-dom';
import React, { lazy } from 'react';
// layouts




// import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
// import Login from './pages/Login';
// import Register from './pages/Register';
// import DashboardApp from './pages/DashboardApp';
// import WorkDashboard from './pages/WorkDashboard';
// import Products from './pages/Products';
// import Landing from './Landing';
// import Blog from './pages/Blog';
// import User from './pages/User';
// import Customers from './pages/Customers';
// import NotFound from './pages/Page404';
// import SessionExpired from './pages/SessionExpired';
// import AddCalls from './pages/AddCalls';
// import EditCalls from './pages/EditCalls';
// import WorkUpdate from './pages/WorkUpdate';
// import Profile from './pages/Profile';
// import PaymentProfile from './pages/PaymentProfile';
// import CustomerProfile from './pages/CustomerProfile';
// import WorkToday from './pages/WorkToday';
// import WorkTillDay from './pages/WorkTillDay';
// import PaymentPage from './pages/PaymentPage';

const DashboardLayout = lazy(()=>import('./layouts/dashboard'));
const LogoOnlyLayout = lazy(()=> import('./layouts/LogoOnlyLayout'));
const Login = lazy(()=> import('./pages/Login'));
const Register = lazy(()=> import('./pages/Register'));
const DashboardApp = lazy(()=> import('./pages/DashboardApp'));
const WorkDashboard = lazy(()=> import('./pages/WorkDashboard'));
// const Products = lazy(()=> import('./pages/Products'));

// const Blog = lazy(()=> import('./pages/Blog'));
const User = lazy(()=> import('./pages/User'));
const Customers = lazy(()=> import('./pages/Customers'));
const NotFound = lazy(()=> import('./pages/Page404'));
const SessionExpired = lazy(()=> import('./pages/SessionExpired'));
const AddCalls = lazy(()=> import('./pages/AddCalls'));
const EditCalls = lazy(()=> import('./pages/EditCalls'));
const WorkUpdate = lazy(()=> import('./pages/WorkUpdate'));
const Profile = lazy(()=> import('./pages/Profile'));
const PaymentProfile = lazy(()=> import('./pages/PaymentProfile'));
const CustomerProfile = lazy(()=> import('./pages/CustomerProfile'));
// const WorkToday = lazy(()=> import('./pages/WorkToday'));
// const WorkMonthly = lazy(()=> import('./pages/WorkMonthly'));
const PaymentPage = lazy(()=> import('./pages/PaymentPage'));
const WorkHistory = lazy(()=> import('./pages/Workhistory'));
const MyCollections = lazy(()=> import('./pages/MyCollections'));
const Feedback = lazy(()=> import('./pages/Feedback'));
const FeedbackSubmit = lazy(()=> import('./pages/FeedbackSubmit'));

// ----------------------------------------------------------------------

export default function Router() {
  
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp/> },
        { path: 'work', element: <WorkDashboard />},
        { path: 'user', element: <User /> },
        { path: 'customers', element: <Customers/>  },
        // { path: 'products', element: <Products /> },
        // { path: 'blog', element: <Blog /> },
        { path: 'newCalls', element: <AddCalls /> },
        { path: 'profile', element: <Profile /> },
        { path: 'work/:workId', element: <WorkUpdate/>},
        { path: 'workHistory/:workId', element: <WorkHistory/>},
        { path: 'customer/:custId', element: <CustomerProfile/>},
        { path: 'payment', element: <PaymentProfile/>},
        // { path: 'todaysWork', element: <WorkToday/>},
        // { path: 'tillDaysWork', element: <WorkMonthly/>},
        { path: 'editCalls/:workId', element: <EditCalls/>},
        { path: 'payment/:workId', element: <PaymentPage/>},
        { path: 'myCollections', element: <MyCollections/>},
        
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { element: <Navigate to="/login" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: 'sessionExpired', element: <SessionExpired /> },
        { path: '/', element: <Login /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'feedback/:ciphertext', element: <Feedback/>},
        { path: 'submitFeedback', element: <FeedbackSubmit/>},
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
