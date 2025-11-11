import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient/queryClient';
import { store } from './store/store';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const isDevMode = process.env.NODE_ENV === 'development';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <BrowserRouter>
            <App />
            {isDevMode && <ReactQueryDevtools initialIsOpen={false} />}
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
