import { filter } from 'lodash';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
// import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import close from '@iconify/icons-ant-design/close-circle-outlined';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Alert,
  OutlinedInput,
  IconButton,
  TextField,
  Link
} from '@mui/material';

// components
import Page from '../components/Page';
// import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';

//
// import USERLIST from '../_mocks_/user';

const axios = require('axios');

// import { number } from 'prop-types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },

  { id: 'number', },
  { id: '' }
];




// ----------------------------------------------------------------------


const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.common.black} !important`
  }
}));

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
export default function User() {
  const [USERLIST, setUSERLIST] = useState([]);
  const navigate = useNavigate();
  const profileData = useSelector((state) => state.profileReducer);
  // const number = useSelector((state)=>state.profileReducer.number);
  // const img = useSelector((state)=>state.profileReducer.img);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [success, setSuccess] = useState(false);
  const AddSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name is required'),

    phone: Yup.number('Mobile number must be numeric.').min(1000000000, 'Please enter a valid number.').required('Number is required'),


  });
  useEffect(() => {
    console.log('redux_id:', profileData);
    axios.get('http://localhost:5000/users/getMembers', { params: { 'id': profileData.id } })
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
  }, [error, success, profileData, refresh]);



  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [number, setNumber] = useState('');
  const [tName, setTName] = useState('');
  const [showAdd, setShowAdd] = useState(false);



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

  const handleDelete = (event, memberId) => {
    axios.post('http://localhost:5000/users/deleteMembers', { 'parent_id': profileData.id, 'member_id': memberId })
      .then((res) => {

        if (!Object.keys(cookies).length) {
          navigate('/sessionExpired')
        }
        else {
          setRefresh(true);
          setRefresh(false);
          console.log('res:', res);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
    // console.log('number34:', n);
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
  };

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

  const handleNumber = (event) => {
    setNumber(event.target.value);
  };
  const handleTName = (event) => {
    setTName(event.target.value);
  };

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

  // const handleAdd = () => {

  //   console.log('Add');
  //   axios.post('http://localhost:5000/users/addMembers', {
  //     'number': number,
  //     'name': tName,
  //     'pNumber': localStorage.getItem('number')
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       if (res.data === 'success') {
  //         setNumber('');
  //         setTName('');
  //         setError(false);
  //         setSuccess(true);


  //       }

  //       else if (res.data === 'no_user') {
  //         setSuccess(false);
  //         setError(true);
  //       }

  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //     })
  // }


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = false;
  // filteredUsers.length === 0;

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',


    },
    validationSchema: AddSchema,
    onSubmit: () => {
      // console.log('imag', formik.values.name);
      console.log('Add');
      axios.post('http://localhost:5000/users/addMembers', {
        'number': formik.values.phone,
        'name': formik.values.name,
        'pNumber': localStorage.getItem('number')
      })
        .then((res) => {
          console.log(res);
          if (res.data === 'success') {
            formik.values.name = '';
            formik.values.phone = '';
            setNumber('');
            setTName('');
            setRefresh(true);
            setRefresh(false);
            setError(false);
            setSuccess(true);


          }

          else if (res.data === 'user_exists') {
            setSuccess(false);
            setError(true);
          }

        })
        .catch((err) => {
          console.log('err', err);
        })


    }


  });

  const { touched, errors, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="My Team">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Team
          </Typography>

          {
            showAdd || profileData.user_type === 'M' ?
              <></>
              :
              <Button
                variant="contained"
                onClick={handleNewMember}
                startIcon={<Icon icon={plusFill} />}
              >
                New Member
              </Button>
          }
        </Stack>
        {
          showAdd &&
          (<Card sx={{ mb: 3, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" >
              <Typography variant="h6" gutterBottom>
                Add a new member
              </Typography>
              <Icon color="red" onClick={handleNewMember} icon={close} width={22} height={22} />
            </Stack>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2} >
                <TextField
                  inputProps={{ maxLength: 10 }}
                  label="Phone number"
                  value={number}
                  onChange={handleNumber}
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />

                <TextField
                  inputProps={{ maxLength: 50 }}
                  label="Name"
                  value={tName}
                  onChange={handleTName}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <Button 
                
                type="submit"
                >Add</Button>
              </Stack >
            </Form>
          </FormikProvider>
              {
          error &&
          <Stack m={2}>
            <Alert severity="error">Cannot add this number as it already exists!</Alert>
          </Stack>
        }
        {
          success &&
          <Stack m={2}>
            <Alert severity="success">Member added successfully!</Alert>
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
                    const { img, name, number, memberId } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={memberId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, name)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={img} sx={{width:32, height:32}}/>
                            <Typography variant="subtitle2" >
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {/* <TableCell align="left">{company}</TableCell> */}
                        <TableCell align="left">
                        <Link href={`tel:${number}`}><Icon icon="ph:phone-call-light" width={24} height={24}/></Link>
                            
                        </TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'inactive' && 'error') || 'success'}
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell> */}

                        <TableCell align="left">
                          {/* <UserMoreMenu handleDelete={(event)=>handleDelete(event,memberId)} memberId={memberId}/> */}
                          <IconButton onClick={(event) => handleDelete(event, memberId)}>
                            <Icon icon={trash2Outline} width={24} height={24} />
                          </IconButton>
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
    </Page >
  );
}
