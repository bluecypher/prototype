import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
// material
import { Stack, TextField, Typography, Checkbox, Grid, Autocomplete, Button, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// import { number } from 'prop-types';
// import PINCODE from '../../../utils/pincode';
import { createFilterOptions } from '@mui/material/Autocomplete';
import imageCompression from 'browser-image-compression';
import PINCODE from '../../../utils/pincodes';


const axios = require('axios');
// ----------------------------------------------------------------------

export default function RegisterForm() {
  
  const navigate = useNavigate();
  const data = useSelector((state) => state.profileReducer)
  // const [servData,setServData] = useState([]);
  // let services;
  const [services, setServices] = useState([]);
  const [pini, setPini] = useState('');
  useEffect(() => {
    console.log('data', data);
    const temp = PINCODE.filter((item) =>

      (item.Pincode === data.pin && item.Office === data.locality)
    );
    console.log('adda', temp);
    setPn(temp[0]);
    axios.get("/users/getServices", { params: { 'number': localStorage.getItem('number') } })
      .then((res) => {
        setServices(res.data.services);
        if (res.data.userType) {
          setUserType(res.data.userType.user_type);
          formik.setFieldValue('fname', res.data.userType.first_name);
        }




        // const tm = new Date(Date.now())
        console.log("datetike:", res.data);
      })
    axios.post('/users/getUserServices', { 'id': data.id })
      .then((res) => {
        console.log("result", pn);
        let temp = res.data;
        temp = temp.map((item) => {

          item = item.serv_id;

          return item;

        })
        setSelected(temp);


      })
      .catch((err) => {
        console.log("Error", err);
      })
  }, [data.id])
  // const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(data.img);
  const [logo, setLogo] = useState(data.entLogo);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [userType, setUserType] = useState('');
  const [selected, setSelected] = useState([]);
  const [pn, setPn] = useState({});



  const filterOptions = createFilterOptions({ matchFrom: 'start' });

  const fileToDataUri = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
  })

  const fileChangeHandler = (file) => {
    if (!file) {
      setImage('');
      return;
    }

    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    console.log(`OriginalFile size ${file.size / 1024 / 1024} MB`);
    imageCompression(file, options).then((compressedFile) => {
      console.log('compressedFile typeof',compressedFile); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      fileToDataUri(compressedFile)
        .then(dataUri => {
          setImage(dataUri)
        })
      
      // setImage(compressedFile);
    })
      .catch((error) => {
        console.log(error.message);
      });
    
    

    // console.log('image:', image);
  }

  const LogoChangeHandler = (file) => {
    if (!file) {
      setLogo('');
      return;
    }

    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    imageCompression(file, options).then((compressedFile) => {
      // console.log('compressedFile instanceof Blob', typeof compressedFile); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      fileToDataUri(compressedFile)
        .then(dataUri => {
          setLogo(dataUri)
        })
      
      // return uploadToServer(compressedFile); // write your own logic
    })
      .catch((error) => {
        console.log(error.message);
      });

    // console.log('image:', logo);
  }

  const handleCheck = (e, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    // console.log('click', newSelected);
  }
  // const onSubmitHandler = () => {
  //   console.log(image);
  // }



  const onCancel = () => {
    navigate('/dashboard/work');
    console.log('cancel')
  }


  const RegisterSchema = Yup.object().shape({
    fname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name is Required'),

    add: Yup.string().required('Address is Required'),

    city: Yup.string().required('City is Required'),
    // pin: Yup.number().required('PIN is Required').typeError('Pincode must be numeric.'),
    state: Yup.string().required('State is Required'),
    ent: Yup.string().required("Enterprise Name is Required")

  });

  const RegisterSchema2 = Yup.object().shape({
    fname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name is required'),

    add: Yup.string().required('Address is required'),




  });

  const formik = useFormik({
    initialValues: {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      add: data.add1,
      add2: data.add2,
      locality: data.locality,
      city: data.city,
      pin: data.pin,
      state: data.state,
      ent: data.ent,
      hghlts: data.hghlts
    },
    validationSchema:
      (userType === 'M') ?
        RegisterSchema2
        :
        RegisterSchema
    ,
    // validator: () => {},
    onSubmit: (values) => {
      // console.log('imag', formik.values.name);
      const nm = localStorage.getItem('number');
      // console.log('number:', values);
      const sTime = new Date().getTime();
      // const formData = new FormData();
      // formData.append('fname', formik.values.fname);
      // formData.append('lname', formik.values.lname);
      // formData.append('email', formik.values.email);
      // formData.append('number', nm);
      // formData.append('img', image);
      // formData.append('addr1', formik.values.add);
      // formData.append('addr2', formik.values.add2);
      // formData.append('locality', formik.values.locality);
      // formData.append('city', formik.values.city);
      // formData.append('pin', pini);
      // formData.append('state', formik.values.state);
      // formData.append('ent', formik.values.ent);
      // formData.append('entLogo', logo);
      // formData.append('services', selected);
      // formData.append('hghlts', formik.values.hghlts);

      axios.post('/users/updateDetails', 
      {
        'fname': formik.values.fname,
        'lname': formik.values.lname,
        'email': formik.values.email,
        'number': nm,
        'img': image,
        'addr1': formik.values.add,
        'addr2': formik.values.add2,
        'locality': formik.values.locality,
        'city': formik.values.city,
        'pin': pini,
        'state': formik.values.state,
        'ent': formik.values.ent,
        'entLogo': logo,
        'services': selected,
        'hghlts': formik.values.hghlts
      },
      // formData,
      // {headers: {
      //   "Content-Type": "multipart/form-data",
      // }},
      )
        .then((response) => {
          // console.log("response:", response);
          const eTime = new Date().getTime();
          console.log('time taken:',eTime-sTime);
          if (response.data === "Success") {
            const eTime = new Date().getTime();
            console.log('time taken:',eTime-sTime);
            navigate('/dashboard', { replace: true });
          }
        })
        .catch((e) => {
          console.log("Error", e);
        })


    }


  });

  const { touched, errors, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>

            <TextField

              fullWidth
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              label="First name"
              {...getFieldProps('fname')}
              error={Boolean(touched.fname && errors.fname)}
              helperText={touched.fname && errors.fname}
            />

            <TextField
              fullWidth
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              label="Last name"
              {...getFieldProps('lname')}
              error={Boolean(touched.lname && errors.lname)}
              helperText={touched.lname && errors.lname}
            />




          </Stack>
          {userType === 'M' ?
            (<></>)
            :
            (<TextField
              fullWidth
              type="text"
              label="Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />)}
          <Stack spacing={1}>
            <Stack direction="row" spacing={6}>
              <Typography variant="h6">
                Upload photo
              </Typography>
              {
                image &&
                (<img width="30" height="30" src={image} alt="avatar" />)
              }
            </Stack>
            <input
              accept="image/*"
              type="file"
              onChange={(event) => { fileChangeHandler(event.target.files[0] || null) }}
            />


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

          {userType === 'M' ?
            (<></>)
            :
            (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  type="text"
                  label="Address line 2"
                  {...getFieldProps('add2')}
                  error={Boolean(touched.add2 && errors.add2)}
                  helperText={touched.add2 && errors.add2}
                />


                <Autocomplete
                  id="filter-demo"
                  options={PINCODE}
                  // value={pn}
                  value={pn}
                  getOptionLabel={(option) => `${option.Pincode}, ${option.Office}`}
                  filterOptions={filterOptions}
                  // renderOption={(props, option) => <li key={option.Id} {...props}>{option.Pincode}, {option.Locality}</li>}
                  onChange={
                    (event, newValue) => {
                      if (newValue) {
                        // console.log('sa', newValue.B);
                        setPn(newValue);
                        setPini(newValue.Pincode);
                        formik.setFieldValue('locality', newValue.Office);
                        formik.setFieldValue('city', newValue.District);
                        formik.setFieldValue('state', newValue.StateName);
                      }
                      else {
                        // console.log('ma', newValue);
                        setPn(newValue);
                      }


                    }
                  }
                  renderInput={(params) =>
                    <TextField
                      inputProps={{ maxLength: 6 }}
                      {...params}
                      label="PIN"

                    />
                    // <TextField
                    //   fullWidth
                    //   label="PIN"

                    //   {...params}
                    //   inputProps={{ maxLength: 6 }}
                    //   {...getFieldProps('pin')}
                    //   error={Boolean(touched.pin && errors.pin)}
                    //   helperText={touched.pin && errors.pin}
                    // />
                  }
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

                  {/* <TextField
                    fullWidth
                    label="PIN"


                    inputProps={{ maxLength: 6 }}
                    {...getFieldProps('pin')}
                    error={Boolean(touched.pin && errors.pin)}
                    helperText={touched.pin && errors.pin}
                  /> */}


                </Stack>
                <TextField
                  fullWidth
                  label="State"
                  {...getFieldProps('state')}
                  error={Boolean(touched.state && errors.state)}
                  helperText={touched.state && errors.state}
                />
                <TextField
                  fullWidth
                  label="Enterprise"
                  {...getFieldProps('ent')}
                  error={Boolean(touched.ent && errors.ent)}
                  helperText={touched.ent && errors.ent}
                />
                <Stack spacing={1}>
                  <Stack direction="row" spacing={6}>
                    <Typography variant="h6">
                      Upload Enterprise Logo
                    </Typography>
                    {
                      logo &&
                      (<img width="30" height="30" src={logo} alt="avatar" />)
                    }
                  </Stack>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(event) => { LogoChangeHandler(event.target.files[0] || null) }}
                  />


                </Stack>
                {/* <FormControl>
            <InputLabel>Service Provided</InputLabel>

            <Select

              value={selectedService}
              label="Service Provided"
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {services.map( (s,i) => 
              <MenuItem index={i} value={s.serv_id}>{s.serv_name}</MenuItem>
              
              )}
              
            </Select>
          </FormControl> */}
                <Typography variant="h6" >
                  Services Provided
                </Typography>
                <Grid container spacing={1}>
                  {services.map((s, i) => {
                    const isItemSelected = selected.indexOf(s.serv_id) !== -1
                    return (
                      <Stack key={s.serv_id} direction="row" >
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => handleCheck(event, s.serv_id)}
                        />
                        <Typography alignSelf='center' variant="subtitle2" >
                          {s.serv_name}
                        </Typography>
                      </Stack>
                    )
                  }
                  )}
                </Grid>

                {/* <TextField
            fullWidth
            type="text"
            label="Service Provided"
            {...getFieldProps('service')}
            error={Boolean(touched.service && errors.service)}
            helperText={touched.service && errors.service}
          /> */}

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
              </Stack>
            )
          }

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"

          >
            Update
          </LoadingButton>
          {
            data.id &&
            <Button variant="outlined" color="error" sx={{ border: 1.5 }} onClick={onCancel}>
              Cancel
            </Button>

          }
          {/* {JSON.stringify(errors)} */}
        </Stack>
      </Form>
    </FormikProvider>
  );
}
