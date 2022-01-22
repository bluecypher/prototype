import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// import { Icon } from '@iconify/react';
// import eyeFill from '@iconify/icons-eva/eye-fill';
// import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useCookies } from 'react-cookie';
// material
import {
  Link,
  Stack,
  Alert,
  TextField,

} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const axios = require('axios');

// ----------------------------------------------------------------------

// const styles = (theme) => ({
//   textField: {
//     borderColor:'black'
//   }
// });


function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState('');
  const [error, setError] = useState(false);
  const [cookies, setCookie] = useCookies('');
  const [tmplt,setTmplt] = useState('Dear user, OTP to login to Sahayak is ');
  const data = useSelector((state)=>state.profileReducer);
  const LoginSchema = Yup.object().shape({
    number: Yup.number('Mobile number must be numeric.').min(1000000000, 'Too Short. Please enter a valid number.').required('Mobile number is required'),
    // password: Yup.string().required('OTP is required')
  });
  useEffect(() => {
    console.log(data);
    if (cookies.token && data.number) {

      navigate('/dashboard', { replace: true });
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      number: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      console.log(window.event);
      if (window.event.submitter.id === 'signin') {
        if (values.password && values.password === '123456') {
          axios.post('http://localhost:5000/users/login', {
            'number': values.number
          },
            {
              'access-control-allow-origin': '*'
            })
            .then((response) => {
              console.log(response)
              if (response.data.res === "success") {

                localStorage.setItem('number', values.number);
                setCookie("token", response.data.jwToken, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 60*2) });

                if (response.data.status === 'F') {
                  navigate('/dashboard', { replace: true });
                }
                else {
                  navigate('/register', { replace: true });
                }
              }
            })
            .catch((e) => {
              console.log("Error", e);
            })
        }
        else{
          setError(true);
          console.log('less than 6');
        }
      }
      else {
       const temp=Math.floor(100000 + Math.random() * 900000).toString(); 
       const msg = (tmplt.concat(temp,". Do not share it with anyone."));
        setOTP(temp);
        console.log(msg);
        
      //   axios.get("https://www.fast2sms.com/dev/bulkV2",{params:{'authorization' : "YgzaI0vM7BZLWe9cdHUwf41GkqiESbpNusX3tToK6Oy2Qnmjlr1olWahGJ3fzXv8iYQTdtIpsUcRCnDq",
      //   'route' : 'q',
      //   'message': msg,
      //   'language' : "english",
      //   'numbers' : values.number,
      //   'flash' : "0"

      // }})
      // .then((res)=>{
      //   console.log("OTP api response:",res);
      // })
      // .catch((err)=>{
      //   console.log("error in otp api",err);
      // })
      }


    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    // <FormikProvider value={formik}>
    //   <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
    //     <Stack spacing={3}>
    //       <TextField
    //         fullWidth
    //         inputProps={{maxLength:10}}

    //         label="मोबाइल नंबर"
    //         {...getFieldProps('number')}
    //         error={Boolean(touched.number && errors.number)}
    //         helperText={touched.number && errors.number}
    //       />

    //       <LoadingButton
    //         fullWidth
    //         size="large"

    //         variant="contained"
    //         loading={isSubmitting}
    //         onClick={()=>{

    //           console.log('get otp')}}
    //       >
    //         ओटीपी प्राप्त करें
    //       </LoadingButton>
    //       <TextField
    //         fullWidth

    //         type={showPassword ? 'text' : 'password'}
    //         label="ओटीपी"
    //         {...getFieldProps('password')}
    //         inputProps={{
    //           maxLength:6,
    //           // endAdornment: (
    //           //   <InputAdornment position="end">
    //           //     <IconButton onClick={handleShowPassword} edge="end">
    //           //       <Icon icon={showPassword ? eyeFill : eyeOffFill} />
    //           //     </IconButton>
    //           //   </InputAdornment>
    //           // )

    //         }}

    //         error={Boolean(touched.password && errors.password)}
    //         helperText={touched.password && errors.password}
    //       />
    //     </Stack>

    //     <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
    //       {/* <FormControlLabel
    //         control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
    //         label="Remember me"
    //       /> */}

    //       <Link component={RouterLink} variant="subtitle2" to="#">
    //       ओ.टी.पी दुबारा  भेजें?
    //       </Link>
    //     </Stack>

    //     <LoadingButton
    //       fullWidth
    //       size="large"
    //       type="submit"
    //       variant="contained"
    //       loading={isSubmitting}
    //     >
    //      साइन इन करें
    //     </LoadingButton>
    //   </Form>
    // </FormikProvider>

    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 10 }}

            label="Mobile number"
            {...getFieldProps('number')}
            error={Boolean(touched.number && errors.number)}
            helperText={touched.number && errors.number}
          />

          <LoadingButton
            id="otp"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            
          // loading={isSubmitting}

          >
            Get OTP
          </LoadingButton>
          <TextField
            fullWidth

            type={showPassword ? 'text' : 'password'}
            label="OTP"
            {...getFieldProps('password')}
            inputProps={{
              maxLength: 6,
              // endAdornment: (
              //   <InputAdornment position="end">
              //     <IconButton onClick={handleShowPassword} edge="end">
              //       <Icon icon={showPassword ? eyeFill : eyeOffFill} />
              //     </IconButton>
              //   </InputAdornment>
              // )

            }}

            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          {
              error &&
              <Stack m={2}>
                <Alert severity="error">OTP does not match!</Alert>
              </Stack>
            }
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
          id="signin"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        // loading={isSubmitting}
        >
          Sign In
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}


export default (LoginForm);