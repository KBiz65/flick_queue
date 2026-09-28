import React, { useState } from 'react';
import { Alert, AppBar, Avatar, Toolbar, Typography, Box, Button, IconButton, TextField, InputAdornment, Menu, MenuItem, Snackbar } from '@mui/material';
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
    const [logoutFailed, setLogoutFailed] = useState(false);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const dispatch = useDispatch();
    const searchItem = useSelector((state) => state.search.searchItem);
    const isSearchInvalid = useSelector((state) => state.search.isSearchInvalid);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
    const firstName = useSelector((state) => state.auth.firstName);

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

    const navigateToWatchlists = () => {
        router.push('/watchlists');
        handleClose();
    };

    const navigateToProfile = () => {
        router.push('/profile');
        handleClose();
    };

    const handleLogout = async () => {
        handleClose();
        const result = await dispatch(logout());
        if (logout.rejected.match(result)) {
            setLogoutFailed(true);
            return;
        }
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
        <AppBar position="fixed">
            <Toolbar sx={{ gap: 2, minHeight: { xs: NAVBAR_HEIGHT, sm: NAVBAR_HEIGHT } }}>
                <Typography
                    component="button"
                    onClick={navigateToHome}
                    sx={{
                        font: 'inherit',
                        fontFamily: '"Big Shoulders Display Variable", sans-serif',
                        fontWeight: 800,
                        fontSize: '1.75rem',
                        letterSpacing: '0.02em',
                        color: 'text.primary',
                        background: 'none',
                        border: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    FlickQueue
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        id="searchInput"
                        size="small"
                        placeholder={isSearchInvalid ? 'Type a title to search' : 'Search titles'}
                        value={searchItem}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        error={isSearchInvalid}
                        fullWidth
                        slotProps={{
                            htmlInput: { 'aria-label': 'Search movies and TV shows' },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton onClick={handleSearch} aria-label="search" edge="start" size="small">
                                            <SearchIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                endAdornment: searchItem ? (
                                    <InputAdornment position="end">
                                        <IconButton onClick={clearSearchItem} aria-label="clear search" edge="end" size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            },
                        }}
                        sx={{
                            maxWidth: 560,
                            '& .MuiOutlinedInput-root': { borderRadius: 999, backgroundColor: 'background.paper' },
                            '& .MuiInputBase-input::placeholder': { color: isSearchInvalid ? 'error.main' : 'text.secondary', opacity: 1 },
                        }}
                    />
                </Box>
                <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', minWidth: 40 }}>
                    {isAuthChecked && !isAuthenticated && router.pathname !== '/' && (
                        <Button variant="outlined" onClick={() => router.push('/')}>
                            Log in
                        </Button>
                    )}
                    {isAuthenticated && (
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenu}
                            sx={{ p: 0.5 }}
                        >
                            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700, fontSize: '1rem' }}>
                                {firstName ? firstName.charAt(0).toUpperCase() : '?'}
                            </Avatar>
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
                    <MenuItem onClick={navigateToWatchlists}>My Watchlists</MenuItem>
                    <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
        <Toolbar sx={{ minHeight: { xs: NAVBAR_HEIGHT, sm: NAVBAR_HEIGHT } }} />
        <Snackbar open={logoutFailed} autoHideDuration={6000} onClose={() => setLogoutFailed(false)}>
            <Alert severity="error" onClose={() => setLogoutFailed(false)}>
                Couldn&apos;t log out. Please try again.
            </Alert>
        </Snackbar>
        </>
    );
};

export default Navbar;