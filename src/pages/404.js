import ErrorPage from '../components/ErrorPage';

const NotFound = () => (
    <ErrorPage
        code="404"
        title="Page not found"
        message="That page doesn't exist, or the movie, show, or list may have been removed. Try searching for a title above."
    />
);

export default NotFound;