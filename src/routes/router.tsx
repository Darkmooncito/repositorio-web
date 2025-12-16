import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home';
import { RoomPage } from '../pages/RoomPage';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />,
  },
];

export const router = createBrowserRouter(routes);