import { useNavigate } from 'react-router-dom';
import { StandingsPage as StandingsComponent } from '../components/StandingsPage';
import { useAppContext } from '../context/AppContext';

export default function Standings() {
    const { selectedSeason } = useAppContext();
    const navigate = useNavigate();

    return (
        <StandingsComponent
            selectedSeason={selectedSeason}
            onAthleteSelect={(athleteId) => navigate(`/athletes/${athleteId}`)}
        />
    );
}
