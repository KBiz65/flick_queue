import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, TextField, InputAdornment, FormHelperText } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './Navbar.module.css';

const Navbar = ({ searchItem, setSearchItem, handleSearch, isSearchInvalid }) => {

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#000321' }}>
      <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between', }}>
        <Typography variant="h6" sx={{ color: '#ffffff', flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
          FlickQueue
        </Typography>
        <TextField
          id="searchInput"
          size="small"
          placeholder={isSearchInvalid ? 'Please enter a search term' : 'Search for a movie or TV show'}
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearch}>
                  <SearchIcon sx={{ color: '#ffffff' }} />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchItem && (
                  <IconButton onClick={() => { setSearchItem('') }}>
                    <ClearIcon sx={{ color: '#ffffff' }} />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
          sx={{
            width: '60%',
            paddingY: '5px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isSearchInvalid? 'red': '#ffffff', // Change the border color
              },
              '&:hover fieldset': {
                borderColor: isSearchInvalid? 'red': '#ffffff', // Change the border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: isSearchInvalid? 'red': '#ffffff', // Change the border color when focused
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff', // Text color
            },
            '& .MuiInputBase-input::placeholder': {
              color: isSearchInvalid? 'red': '#ffffff',
              opacity: 1,
            },
          }}
        />
        <IconButton
          edge="end"
          sx={{ color: '#ffffff', flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}
          aria-label="account of current user"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
