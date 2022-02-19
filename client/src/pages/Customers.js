import { filter } from 'lodash';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
// import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useFormik, Form, FormikProvider } from 'formik';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { useSelector } from "react-redux";
// material
// import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import close from '@iconify/icons-ant-design/close-circle-outlined';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  Modal,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  Alert,
  Link,
  IconButton,

} from '@mui/material';

// components
import Page from '../components/Page';
// import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import {
  UserListHead, UserListToolbar,
  //  UserMoreMenu 
} from '../components/_dashboard/user';

//


const axios = require('axios');

// import { number } from 'prop-types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },

  { id: 'number', },
  { id: '' }
];




// ----------------------------------------------------------------------





function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// let filteredUsers=[];
export default function Customers() {
  const [USERLIST, setUSERLIST] = useState([]);
  const navigate = useNavigate();
  const id = useSelector((state) => state.profileReducer.id);
  const prevPage = useSelector((state) => state.navReducer.prev);

  const AddSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name is required'),

    phone: Yup.number('Mobile number must be numeric.').min(1000000000, 'Please enter a valid number.').required('Number is required').typeError('Mobile number must be numeric.'),


  });
  const AddSchema2 = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name is required'),

    phone: Yup.number('Mobile number must be numeric.').min(1000000000, 'Please enter a valid number.').required('Number is required').typeError('Mobile number must be numeric.'),


  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onItemClick = (event, id) => {


    navigate(`/dashboard/customer/${id}`);
  }
  useEffect(() => {
    console.log("props", prevPage);
    axios.post('/users/getCustomersList', { 'id': id })
      .then((res) => {

        if (!Object.keys(cookies).length) {
          navigate('/sessionExpired')
        }
        else {
          // let uList = [];
          // uList = res.data.map(item => {

          //   if (item.img) {
          //     if (item.img.data) {
          //       const bufferOriginal = Buffer.from(item.img.data);
          //       item.img = bufferOriginal.toString('utf8');
          //       // setImg(bufferOriginal.toString('utf8'));
          //     }

          //   }
          //   return item;
          // });
          console.log('res data:', res.data);
          setUSERLIST(res.data);

        }
      })
      .catch((err) => {
        console.log('err', err);
      })
  }, [error, success, id, refresh]);



  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [number, setNumber] = useState('');
  // const [cName, setCName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showAdd2, setShowAdd2] = useState(false);
  // const [add, setAdd] = useState('');





  const [cookies, setCookies] = useCookies('');
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  // const handleNumber = (event) => {
  //   setNumber(event.target.value);
  // };

  // const handleCName = (event) => {
  //   setCName(event.target.value);
  // };

  // const handleAdd = (event) => {
  //   setAdd(event.target.value);
  // };

  const handleNewMember = () => {
    // console.log('filtered:',filteredUsers)
    if (showAdd) {
      setShowAdd(false);
      setError(false);
      setSuccess(false);
    }
    else {
      setShowAdd(true);
      setError(false);
      setSuccess(false);
    }

  };
  const handleNewMember2 = () => {
    // console.log('filtered:',filteredUsers)
    if (showAdd2) {
      setShowAdd2(false);
      setError(false);
      setSuccess(false);
    }
    else {
      setShowAdd2(true);
      setError(false);
      setSuccess(false);
    }

  };

  // const handleDelete = (event, memberId) => {
  //   console.log(id, ' ', memberId);
  //   axios.post('/users/deleteCustomers', { 'parent_id': id, 'member_id': memberId })
  //     .then((res) => {

  //       if (!Object.keys(cookies).length) {
  //         navigate('/sessionExpired')
  //       }
  //       else {
  //         setRefresh(true);
  //         setRefresh(false);
  //         console.log('res:', res);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //     })
  //   // console.log('number34:', n);
  // }

  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = false;
  // filteredUsers.length === 0;

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',

    },
    validationSchema: AddSchema,
    onSubmit: () => {
      // console.log('imag', formik.values.name);
      axios.post('/users/addCustomers', {
        'number': formik.values.phone,
        'id': id,
        'name': formik.values.name,
        'add': formik.values.address,
      })
        .then((res) => {
          console.log(res);
          if (res.data === 'Success') {
           
            formik.values.name = '';
            formik.values.phone = '';
            formik.values.address = '';
           
            setRefresh(true);
            setRefresh(false);
            setError(false);
            setSuccess(true);


          }

          else if (res.data.code === 'ER_DUP_ENTRY') {
            setSuccess(false);
            setError(true);
          }

        })
        .catch((err) => {
          console.log('err', err);
        })


    }


  });

  const formik2 = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      id: '',

    },
    validationSchema: AddSchema2,
    onSubmit: () => {
      // 
      axios.post('/users/editCustomers', {
        'number': formik2.values.phone,
        'id': formik2.values.id,
        'name': formik2.values.name,
        'add': formik2.values.address,
      })
        .then((res) => {
          console.log(res);
          if (res.data === 'success') {
            
            formik2.values.name = '';
            formik2.values.phone = '';
            formik2.values.address = '';
            
            setRefresh(true);
            setRefresh(false);
            setError(false);
            setSuccess(true);
            handleNewMember2();

          }

          else if (res.data.code === 'ER_DUP_ENTRY') {
            setSuccess(false);
            setError(true);
          }

        })
        .catch((err) => {
          console.log('err', err);
        })
      console.log('imag', formik2.values.id);

    }


  });
  const editUsers = (e, id) => {
    formik2.values.id = id;
    setShowAdd2(true);
    const temp = USERLIST.filter((item) => item.custId === id);
    formik2.values.name = temp[0].name;
    formik2.values.phone = temp[0].number;
    formik2.values.address = temp[0].address1;
    console.log('add');
  }


  const { touched, errors, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="Customers">
      <Container>
      <Modal open={showAdd2} onClose={handleNewMember2}>
          <Card sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            p: 3
          }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Add a new Customer
              </Typography>
              <Icon color="red" onClick={handleNewMember2} icon={close} width={22} height={22} />
            </Stack>
            <FormikProvider value={formik2}>
              <Form autoComplete="off" noValidate onSubmit={formik2.handleSubmit}>
                <Stack spacing={2} >
                  <TextField
                    inputProps={{ maxLength: 10 }}
                    label="Phone number"
                    // value={number}
                    // onChange={handleNumber}
                    {...formik2.getFieldProps('phone')}
                    error={Boolean(formik2.touched.phone && formik2.errors.phone)}
                    helperText={formik2.touched.phone && formik2.errors.phone}
                  />
                  <TextField
                    inputProps={{ maxLength: 40 }}
                    label="Name"
                    // value={cName}
                    // onChange={handleCName}
                    {...formik2.getFieldProps('name')}
                    error={Boolean(formik2.touched.name && formik2.errors.name)}
                    helperText={formik2.touched.name && formik2.errors.name}
                  />

                  <TextField
                    inputProps={{ maxLength: 60 }}
                    label="Address"
                    // value={add}
                    // onChange={handleAdd}
                    {...formik2.getFieldProps('address')}
                    error={Boolean(formik2.touched.address && formik2.errors.address)}
                    helperText={formik2.touched.address && formik2.errors.address}
                  />


                  <Button type="submit" >Add</Button>
                </Stack >
              </Form>
            </FormikProvider>

            {
              error &&
              <Stack m={2}>
                <Alert severity="error">A Customer with same number already exist in your list!!</Alert>
              </Stack>
            }
            {
              success &&
              <Stack m={2}>
                <Alert severity="success">Customer added successfully!</Alert>
              </Stack>
            }
            </Card>
            </Modal>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Customers List
          </Typography>
          {
            showAdd ?
              <></>
              :
              <Button
                variant="contained"
                onClick={handleNewMember}
                startIcon={<Icon icon={plusFill} />}
              >
                New Customer
              </Button>
          }
        </Stack>
        {
          showAdd &&
          (<Card sx={{ mb: 3, p: 2, }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Add a new Customer
              </Typography>
              <Icon color="red" onClick={handleNewMember} icon={close} width={22} height={22} />
            </Stack>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={2} >
                  <TextField
                    inputProps={{ maxLength: 10 }}
                    label="Phone number"
                    // value={number}
                    // onChange={handleNumber}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                  <TextField
                    inputProps={{ maxLength: 40 }}
                    label="Name"
                    // value={cName}
                    // onChange={handleCName}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <TextField
                    inputProps={{ maxLength: 60 }}
                    label="Address"
                    // value={add}
                    // onChange={handleAdd}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />


                  <Button type="submit" >Add</Button>
                </Stack >
              </Form>
            </FormikProvider>

            {
              error &&
              <Stack m={2}>
                <Alert severity="error">A Customer with same number already exist in your list!!</Alert>
              </Stack>
            }
            {
              success &&
              <Stack m={2}>
                <Alert severity="success">Customer added successfully!</Alert>
              </Stack>
            }
          </Card>)
        }
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: { xs: 300, md: 800 } }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { custId, img, name, number } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          key={custId}
                          hover

                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell> */}
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={img} sx={{ width: 32, height: 32 }} />
                              <Link
                                component="button"
                                variant="body2"
                                onClick={(event) => onItemClick(event, custId)}
                              >{name}
                              </Link>
                              {/* <Typography variant="subtitle2" >
                                
                              </Typography> */}
                            </Stack>
                          </TableCell>
                          {/* <TableCell align="left">{company}</TableCell> */}
                          <TableCell align="left">

                            <Link href={`tel:${number}`}><Icon icon="ph:phone-call-light" width={24} height={24} /></Link>

                          </TableCell>

                          <TableCell align="left">
                            <Link href={`whatsapp://send?phone=+91${number}`}>
                              <Icon icon="logos:whatsapp" width={22} height={22} />
                            </Link>
                          </TableCell>

                          <TableCell align="left">
                            <Link
                              component="button"
                              variant="body2"
                              onClick={(event) => editUsers(event, custId)}
                            >
                              <Icon icon="lucide:pencil" width={20} height={20} />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
