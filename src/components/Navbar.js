import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { performSearch, setSearchItem, setIsSearchInvalid } from '../../store/slices/searchSlice';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const dispatch = useDispatch();
    const searchItem = useSelector((state) => state.search.searchItem);
    const isSearchInvalid = useSelector((state) => state.search.isSearchInvalid);


    const handleProfileMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigateToHome = () => {
        dispatch(setSearchItem(''));
        dispatch(setIsSearchInvalid(false));
        router.push('/home');
        handleClose();
    };

    const navigateToProfile = () => {
        router.push('/profile');
        handleClose();
    };

    const navigateToSearchResults = () => {
        if (!searchItem) return;
        router.push('/searchResults');
    }

    const handleSearch = async () => {
        try {
            const actionResult = await dispatch(performSearch(searchItem));
            const resultData = actionResult.payload;

            console.log('Search result data: ', resultData);

            navigateToSearchResults();
        } catch (error) {
            console.error('Search failed: ', error);
        }
    };

    const handleSearchChange = (event) => {
        dispatch(setSearchItem(event.target.value));
    };

    const clearSearchItem = () => {
        dispatch(setSearchItem(''));
    };

    return (
        <AppBar position="fixed" sx={{ bgcolor: '#080101' }}>
            <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Typography
                        variant="h6"
                        noWrap
                        onClick={navigateToHome}
                        sx={{
                            cursor: 'pointer',
                            color: '#ffffff',
                            textDecoration: 'none',
                        }}
                    >
                        FlickQueue
                    </Typography>
                </Box>
                <TextField
                    id="searchInput"
                    size="small"
                    placeholder={isSearchInvalid ? 'Please enter a search term' : 'Search for a movie or TV show'}
                    value={searchItem}
                    onChange={handleSearchChange}
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
                                    <IconButton onClick={clearSearchItem}>
                                        <ClearIcon sx={{ color: '#ffffff' }} />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: '60%',
                        paddingY: '5px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isSearchInvalid ? 'red' : '#ffffff', // Change the border color
                            },
                            '&:hover fieldset': {
                                borderColor: isSearchInvalid ? 'red' : '#ffffff', // Change the border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: isSearchInvalid ? 'red' : '#ffffff', // Change the border color when focused
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: '#ffffff', // Text color
                            '&:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 100px #080101 inset', // Match the AppBar's bgcolor
                                WebkitTextFillColor: '#ffffff', // Ensure text color remains white
                            }
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: isSearchInvalid ? 'red' : '#ffffff',
                            opacity: 1,
                        },
                    }}
                />
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleProfileMenu}
                    sx={{ color: '#ffffff', flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={navigateToProfile}
                        sx={{
                            maxHeight: '20px',
                        }}
                    >Profile
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
