import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { useCookies } from 'react-cookie';
// import PWAInstallerPrompt from 'react-pwa-installer-prompt';
// material

import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Avatar,
  CardActionArea,
  Alert,
  TextField,
  Icon,
  Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// layouts
// import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
// import { LoginForm } from '../components/authentication/login';
// import AuthSocial from '../components/authentication/AuthSocial';

const axios = require('axios');
const CryptoJS = require("crypto-js");
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',

  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const prevData = JSON.parse(localStorage.getItem('prev_user'));

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [encPin, setEncPin] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [error, setError] = useState(false);
  const [pinError, setPinError] = useState(false);
  // const [supported, setSupported] = useState(false);

  const [cookies, setCookie] = useCookies('');
  const [tmplt, setTmplt] = useState('');
  const data = useSelector((state) => state.profileReducer);
  const LoginSchema = Yup.object().shape({
    number: Yup.number('Mobile number must be numeric.')
      .min(1000000000, 'Too Short. Please enter a valid number.')
      .required('Mobile number is required')
    // password: Yup.string().required('OTP is required')
  });
  const handleSubmit2 = () => {
    if (inputOtp === '123456') {
      localStorage.setItem('number', values.number);
      navigate('/setPin',{replace: true});
      
    } else {
      setError(true);
      console.log('less than 6');
    }
  };

  const handleSubmit3 = () => {
    const bytes  = CryptoJS.AES.decrypt(encPin, 'sahayak2');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log('dec',inputPin);
    if(originalText === inputPin)
    {
    axios
        .post(
          '/users/login',
          {
            number: values.number
          },
          {
            'access-control-allow-origin': '*'
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.res === 'success') {
            localStorage.setItem('number', values.number);
            setCookie('token', response.data.jwToken, {
              path: '/',
              expires: new Date(Date.now() + 1000 * 3600 * 24 * 7)
            });

            if (response.data.status === 'F') {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/register', { replace: true });
            }
          }
        })
        .catch((e) => {
          console.log('Error', e);
        });
      }
      else
      {
        setPinError(true);
      }
    
  }

  useEffect(() => {
    
    if (cookies.token && data.number) {
      navigate('/dashboard', { replace: true });
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      number: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      // console.log(event);

    //   const props = ['name', 'email', 'tel', 'address', 'icon'];
    // const opts = { multiple: true };
    //   navigator.contacts.select(props, opts).then((contacts)=>{
    //     console.log('results:',contacts);
    //   })
      
    //   .catch ((ex)=> {
    //   console.log('err',ex);
    // })

    axios.post('/users/getLogin', { number: values.number }).then((res) => {
      console.log('getlogin', res.data);
      if(res.data==='insert' || res.data[0].password === null)
      {
        setShowOTP(true);
        const temp = Math.floor(100000 + Math.random() * 900000).toString();
        const msg = tmplt.concat(temp, ' is your OTP to login to Sahayaks.');
        setOTP(temp);
        
        console.log(msg);

      //   axios.get("https://www.fast2sms.com/dev/bulkV2",{params:{'authorization' : "YgzaI0vM7BZLWe9cdHUwf41GkqiESbpNusX3tToK6Oy2Qnmjlr1olWahGJ3fzXv8iYQTdtIpsUcRCnDq",
      //   'route' : 'v3',
      //   'sender_id' : 'Cghpet',
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
      else
      {
        setShowPIN(true);
        setEncPin(res.data[0].password);
      }
    })
      .catch((err) => {
        console.log('err', err);
      })

      
    }
  });
  const profileClick = () => {
    formik.setFieldValue('number', prevData.number).then((res) => {
      if (!showOTP) formik.handleSubmit();
    });
  };
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <RootStyle title="Login">
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hello, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Stack sx={{ mb: 5 }} alignItems="center">
              {prevData && (
                <Card sx={{ maxWidth: 345, p: 1, boxShadow: 10, minWidth: 100 }}>
                  <CardActionArea onClick={profileClick}>
                    <Stack spacing={1} alignItems="center">
                      <Stack alignItems="center">
                        {prevData.image ? (
                          <Avatar
                            src={prevData.image}
                            sx={{ width: 50, height: 50, alignSelf: 'center', border: 2 }}
                            alt="photoURL"
                          />
                        ) : (
                          <Avatar
                            sx={{ width: 50, height: 50, alignSelf: 'center' }}
                            alt="photoURL"
                          />
                        )}
                      </Stack>

                      <Typography variant="subtitle2">{prevData.name}</Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              )}
            </Stack>
            {/* <Link href={`whatsapp://send?phone=+91${formik.values.number}`}>calls</Link> */}
            <Typography variant="h4" gutterBottom>
              Log in
            </Typography>
            {/* <PWAInstallerPrompt
              render={({ onClick }) => (
                <Button type="submit" onClick={onClick}> 
                  Install
                </Button>
              )}
              callback={(data) => console.log(data)}
            /> */}
            <Typography sx={{ color: 'text.secondary' }}>
              Please enter your Mobile Number.
            </Typography>

          </Stack>

          {/* <LoginForm /> */}
          <Stack spacing={3}>
            <FormikProvider value={formik}>
              <Form id="myForm" autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    label="Mobile number"
                    {...getFieldProps('number')}
                    error={Boolean(touched.number && errors.number)}
                    helperText={touched.number && errors.number}
                  />
                  {/* <a href="tel:7070024384">7070024384</a> */}
                  {/* <Link href={`tel:${call}`} >call</Link> */}

                  <LoadingButton
                    id="otp"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={showOTP || showPIN}
                  // loading={isSubmitting}
                  >
                    Next
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
            {showOTP && (
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="OTP"
                  // {...getFieldProps('password')}
                  inputProps={{
                    maxLength: 6
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <IconButton onClick={handleShowPassword} edge="end">
                    //       <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    //     </IconButton>
                    //   </InputAdornment>
                    // )
                  }}
                  value={inputOtp}
                  onChange={(event) => setInputOtp(event.target.value)}

                // error={Boolean(touched.password && errors.password)}
                // helperText={touched.password && errors.password}
                />
                {error && (
                  <Stack m={2}>
                    <Alert severity="error">OTP does not match!</Alert>
                  </Stack>
                )}

                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
                  {/* <FormControlLabel
      control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
      label="Remember me"
    /> */}

                  {/* <Link component={RouterLink} variant="subtitle2" to="#">
                    Resend OTP?
                  </Link> */}
                </Stack>

                <LoadingButton
                  id="signin"
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit2}
                // loading={isSubmitting}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            )}
            {showPIN && (
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="PIN"
                  // {...getFieldProps('password')}
                  inputProps={{
                    maxLength: 6
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <IconButton onClick={handleShowPassword} edge="end">
                    //       <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    //     </IconButton>
                    //   </InputAdornment>
                    // )
                  }}
                  value={inputPin}
                  onChange={(event) => setInputPin(event.target.value)}

                // error={Boolean(touched.password && errors.password)}
                // helperText={touched.password && errors.password}
                />
                {pinError && (
                  <Stack m={2}>
                    <Alert severity="error">Wrong PIN!</Alert>
                  </Stack>
                )}

                <LoadingButton
                  id="signin"
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit3}
                // loading={isSubmitting}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        </ContentStyle>
      </Container>

      {/* <MHidden width="mdDown">
  <SectionStyle>
    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
    नमस्ते, वापस स्वागत है
    </Typography>
    <img src="/static/illustrations/illustration_login.png" alt="login" />
  </SectionStyle>
</MHidden>

<Container maxWidth="sm">
  <ContentStyle>
    <Stack sx={{ mb: 5 }}>
      <Typography variant="h4" gutterBottom>
      लॉग इन करें
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>नीचे अपना विवरण दर्ज करें।</Typography>
    </Stack>
    

    <LoginForm />

  
  </ContentStyle>
</Container> */}
    </RootStyle>
  );
}
