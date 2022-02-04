import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// material
import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import profileReducer from '../reducers/profileReducer';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};


export default function Logo({ sx }) {
  const data = useSelector((state)=>state.profileReducer);
  return (
  <Box sx={{...sx}}>
    {
      data.fname?
    <Typography fontFamily='"Segoe UI"' variant="h3">{data.fname} सहायक</Typography>
    :
    <Typography fontFamily='"Segoe UI"' variant="h1">सहायक</Typography>
    }
    </Box>
    );
}