// import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// material
import { useCookies } from 'react-cookie';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
// import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { deleteProfile } from '../actions/index';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export default function SessionExpired() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('sess');
    dispatch(deleteProfile());
    removeCookie('token', { path: '/' });
    localStorage.removeItem('number');

    localStorage.removeItem('persist:root');
  }, []);
  return (
    <RootStyle title="Session Expired">
      <Container>
        {/* <MotionContainer initial="initial" open> */}
        <Box sx={{ maxWidth: 480, margin: 'Auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            You have been logged out!
            {/* सहायक का उपयोग करने के लिए धन्यवाद । */}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>Please login again to continue.</Typography>

          <Box
            component="img"
            src="/static/logo.png"
            sx={{ height: 160, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Login
          </Button>
        </Box>
        {/* </MotionContainer> */}
      </Container>
    </RootStyle>
  );
}
