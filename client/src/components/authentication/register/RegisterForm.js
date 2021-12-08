import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { number } from 'prop-types';

const axios = require('axios');
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [sArea, setSArea] = useState();

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
    })

  const fileChangeHandler = (file) => {
    if(!file) {
      setImage('');
      return;
    }

    fileToDataUri(file)
      .then(dataUri => {
        setImage(dataUri)
      })
    
    console.log(image);
  }

  // const onSubmitHandler = () => {
  //   console.log(image);
  // }


  
    

  
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name required'),

    add: Yup.string().required('Address is required'),
    locality: Yup.string().required('Locality is required'),
    city: Yup.string().required('City is required'),
    pin: Yup.string().required('PIN is required'),
    service: Yup.string().required('Service is required'),
    
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      add: '',
      locality: '',
      city: '',
      pin: '',
      service:'',
      hghlts:''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      // console.log('imag', formik.values.name);
      const nm = localStorage.getItem('number');
      console.log('number:', nm);
      axios.post('http://localhost:5000/users/updateDetails',{
        'name':formik.values.name,
        'number':nm,
        'img':image,
        'addr':formik.values.add,
        'locality':formik.values.locality,
        'city':formik.values.city,
        'pin':formik.values.pin,
        'area':sArea,
        'service':formik.values.service,
        'hghlts':formik.values.hghlts
      })
      .then((response) => {
        console.log("response:",response)
        if(response.data==="Success")
        {
          
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((e) =>{
        console.log("Error",e);
      })
      
      
    }
      
    
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              {...getFieldProps('name')}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />

            {/* <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            /> */}

            <input
              accept="image/*"
              type="file"
              onChange={(event)=>{fileChangeHandler(event.target.files[0] || null)}}
            />
            <img width="200" height="200" src={image} alt="avatar"/>
          </Stack>

          <TextField
            fullWidth
            multiline
            minRows='2'
            type="text"
            label="Address"
            {...getFieldProps('add')}
            error={Boolean(touched.add && errors.add)}
            helperText={touched.add && errors.add}
          />

          <TextField
            fullWidth
            type="text"
            label="Locality"
            {...getFieldProps('locality')}
            error={Boolean(touched.locality && errors.locality)}
            helperText={touched.locality && errors.locality}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="City"
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
            />

            <TextField
              fullWidth
              label="PIN"
              {...getFieldProps('pin')}
              error={Boolean(touched.pin && errors.pin)}
              helperText={touched.pin && errors.pin}
            />
          </Stack>
          <FormControl>
            <InputLabel>Area of Service</InputLabel>

            <Select

              value={sArea}
              label="Area of Service"
              onChange={(e) => setSArea(e.target.value)}
            >
              <MenuItem value={5}>5 KM Radius</MenuItem>
              <MenuItem value={10}>10 KM Radius</MenuItem>
              <MenuItem value={15}>15 KM Radius</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="text"
            label="Service Provided"
            {...getFieldProps('service')}
            error={Boolean(touched.service && errors.service)}
            helperText={touched.service && errors.service}
          />

          <TextField
            fullWidth
            multiline
            minRows='2'
            type="text"
            label="Highlights"
            {...getFieldProps('hghlts')}
            error={Boolean(touched.hghlts && errors.hghlts)}
            helperText={touched.hghlts && errors.hghlts}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}

          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
