import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const axios = require('axios');

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    number: Yup.number().min(10).required('Mobile number is required'),
    password: Yup.string().required('OTP is required')
  });

  const formik = useFormik({
    initialValues: {
      number: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      axios.post('http://localhost:5000/users/login',{
        'number':values.number
      },
      {
        'access-control-allow-origin':'*'
      })
      .then((response) => {
        console.log(response)
        if(response.data==="Success")
        {
          navigate('/register', { replace: true });
        }
      })
      .catch((e) =>{
        console.log("Error",e);
      })
      
      
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            maxlength={10}
            type="number"
            label="Mobile number"
            {...getFieldProps('number')}
            error={Boolean(touched.number && errors.number)}
            helperText={touched.number && errors.number}
          />

          <LoadingButton
            fullWidth
            size="large"
            
            variant="contained"
            loading={isSubmitting}
            onClick={()=>console.log('get otp')}
          >
            Get OTP
          </LoadingButton>
          <TextField
            fullWidth

            type={showPassword ? 'text' : 'password'}
            label="OTP"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          /> */}

          <Link component={RouterLink} variant="subtitle2" to="#">
            Resend OTP?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Sign in
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
