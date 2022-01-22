import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

// material
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import { changeLanguage } from '../../actions/index';

// ----------------------------------------------------------------------

const LANGS = [
  
  {
    value: 'in',
    label: 'Hindi',
    icon: '/static/icons/in.svg'
  },
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg'
  }
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState({
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg'
  });
  useEffect(()=>{
    setLanguage({
      value: 'en',
      label: 'English',
      icon: '/static/icons/ic_flag_en.svg'
    });
  },[])
  const dispatch = useDispatch();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event,option) => {
    
    console.log('language',option);
    if(option.value)
    {
      dispatch(changeLanguage(option.value));
    setLanguage(option);
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 24,
          height: 24,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <img src="/static/icons/language.png" alt="language" />
        <Typography varinat="h2">{language.value}</Typography>
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current}>
        <Box sx={{ py: 1 }}>
          {LANGS.map((option) => (
            <MenuItem
              key={option.value}
              
              selected={option.value === language.value}
              onClick={(event)=>handleClose(event,option)}
              sx={{ py: 1, px: 2.5 }}
            >
              {/* <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon> */}
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
