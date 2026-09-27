import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, TextField, InputAdornment, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchItem, setIsSearchInvalid } from '../store/slices/searchSlice';
import { logout } from '../store/slices/authSlice';

// Fixed navbar height; the spacer below uses the same value so page content always starts underneath it
const NAVBAR_HEIGHT = 64;

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const dispatch = useDispatch();
    const searchItem = useSelector((state) => state.search.searchItem);
    const isSearchInvalid = useSelector((state) => state.search.isSearchInvalid);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

    const handleProfileMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigateToHome = () => {
        dispatch(setSearchItem(''));
        dispatch(setIsSearchInvalid(false));
        router.push(isAuthenticated ? '/dashboard' : '/');
        handleClose();
    };

    const navigateToDashboard = () => {
        router.push('/dashboard');
        handleClose();
    };

    const navigateToProfile = () => {
        router.push('/profile');
        handleClose();
    };

    const handleLogout = async () => {
        handleClose();
        await dispatch(logout());
        router.push('/');
    };

    // The results page reads the search term from the URL, so refreshing or sharing the link works
    const handleSearch = () => {
        const trimmedSearch = searchItem.trim();
        if (!trimmedSearch) {
            dispatch(setIsSearchInvalid(true));
            return;
        }
        router.push({ pathname: '/searchResults', query: { q: trimmedSearch } });
    };

    const handleSearchChange = (event) => {
        dispatch(setSearchItem(event.target.value));
        if (isSearchInvalid) dispatch(setIsSearchInvalid(false));
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') handleSearch();
    };

    const clearSearchItem = () => {
        dispatch(setSearchItem(''));
    };

    return (
        <>
        <AppBar position="fixed" sx={{ bgcolor: '#080101' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: { xs: NAVBAR_HEIGHT, sm: NAVBAR_HEIGHT } }}>
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
                    onKeyDown={handleSearchKeyDown}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={handleSearch} aria-label="search">
                                        <SearchIcon sx={{ color: '#ffffff' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchItem && (
                                        <IconButton onClick={clearSearchItem} aria-label="clear search">
                                            <ClearIcon sx={{ color: '#ffffff' }} />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        },
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
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {isAuthChecked && !isAuthenticated && (
                        <Button onClick={() => router.push('/')} sx={{ color: '#ffffff', textTransform: 'none' }}>
                            Log In
                        </Button>
                    )}
                    {isAuthenticated && (
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenu}
                            sx={{ color: '#ffffff' }}
                        >
                            <AccountCircle />
                        </IconButton>
                    )}
                </Box>
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
                    <MenuItem onClick={navigateToDashboard}>Dashboard</MenuItem>
                    <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
        <Toolbar sx={{ minHeight: { xs: NAVBAR_HEIGHT, sm: NAVBAR_HEIGHT } }} />
        </>
    );
};

export default Navbar;