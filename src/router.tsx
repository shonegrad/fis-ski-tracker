import { createHashRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Lazy load route components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Races = lazy(() => import('./pages/Races'));
const Locations = lazy(() => import('./pages/Locations'));
const Athletes = lazy(() => import('./pages/Athletes'));
const Standings = lazy(() => import('./pages/Standings'));
const Discipline = lazy(() => import('./pages/Discipline'));
const Settings = lazy(() => import('./pages/Settings'));
const AthleteDetail = lazy(() => import('./pages/AthleteDetail'));

const router = createHashRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense> },
            { path: 'races', element: <Suspense fallback={<LoadingSpinner />}><Races /></Suspense> },
            { path: 'locations', element: <Suspense fallback={<LoadingSpinner />}><Locations /></Suspense> },
            { path: 'athletes', element: <Suspense fallback={<LoadingSpinner />}><Athletes /></Suspense> },
            { path: 'athletes/:athleteId', element: <Suspense fallback={<LoadingSpinner />}><AthleteDetail /></Suspense> },
            { path: 'standings', element: <Suspense fallback={<LoadingSpinner />}><Standings /></Suspense> },
            { path: 'discipline/:discipline', element: <Suspense fallback={<LoadingSpinner />}><Discipline /></Suspense> },
            { path: 'settings', element: <Suspense fallback={<LoadingSpinner />}><Settings /></Suspense> },
        ],
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
