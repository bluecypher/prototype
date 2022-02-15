import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// material
import { Avatar, Box, Typography, Stack } from '@mui/material';


// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};


export default function Logo({ sx }) {
  const data = useSelector((state) => state.profileReducer);
  return (
    <Box sx={{ ...sx }}>
      {
        data.fname ?
          <Typography fontFamily='"Segoe UI"' variant="h3">{data.fname} सहायक</Typography>
          :
          <Stack alignItems="center"><Avatar sx={{ width: 42, height: 42 }} src="/static/logo.png" alt="sahayak" />
            <Typography fontFamily='"Segoe UI"' variant="h1">   सहायक</Typography></Stack >
      }
    </Box >
  );
}