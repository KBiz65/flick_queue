import ErrorPage from '../components/ErrorPage';

const ServerError = () => (
    <ErrorPage
        code="500"
        title="Something went wrong"
        message="The server ran into a problem loading this page. Please try again in a minute."
    />
);

export default ServerError;