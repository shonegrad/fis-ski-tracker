import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
    const { selectedSeason } = useAppContext();
    const navigate = useNavigate();

    const handleViewChange = (view: string) => {
        switch (view) {
            case 'dashboard':
                navigate('/');
                break;
            case 'races':
                navigate('/races');
                break;
            case 'locations':
                navigate('/locations');
                break;
            case 'athletes':
                navigate('/athletes');
                break;
            case 'standings':
                navigate('/standings');
                break;
            case 'settings':
                navigate('/settings');
                break;
            case 'slalom':
            case 'giant-slalom':
            case 'super-g':
            case 'downhill':
                navigate(`/discipline/${view}`);
                break;
            default:
                navigate('/');
        }
    };

    return (
        <DashboardComponent
            selectedSeason={selectedSeason}
            onViewChange={handleViewChange}
        />
    );
}
