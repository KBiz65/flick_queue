import { Provider } from 'react-redux';
import { wrapper } from '../store/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
}

export default MyApp;