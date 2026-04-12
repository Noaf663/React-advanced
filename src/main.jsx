import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider';

import { Root } from './components/Root';
import { EventsPage } from './pages/EventsPage';
import { EventPage } from './pages/EventPage';
import { ContactPage } from './pages/ContactPage';
import { Toaster } from './components/ui/toaster';
import { EventsProvider } from './pages/EventsContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <EventsPage />,
      },
      {
        path: 'event/:eventId',
        element: <EventPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider>
      <EventsProvider>
    <RouterProvider router={router} />
    <Toaster />
    </EventsProvider>
    </Provider>
  </React.StrictMode>
);