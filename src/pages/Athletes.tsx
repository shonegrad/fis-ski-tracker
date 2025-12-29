import { useNavigate } from 'react-router-dom';
import { EnhancedCompetitorList } from '../components/EnhancedCompetitorList';
import { useAppContext } from '../context/AppContext';

export default function Athletes() {
    const { selectedSeason } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <EnhancedCompetitorList
                selectedSeason={selectedSeason}
                onBack={() => navigate('/')}
                onCompetitorSelect={(athleteId) => navigate(`/athletes/${athleteId}`)}
            />
        </div>
    );
}
