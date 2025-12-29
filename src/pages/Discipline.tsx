import { useParams, useNavigate } from 'react-router-dom';
import { DisciplinePage as DisciplineComponent } from '../components/DisciplinePage';
import { useAppContext } from '../context/AppContext';

export default function Discipline() {
    const { discipline } = useParams<{ discipline: string }>();
    const { selectedSeason } = useAppContext();
    const navigate = useNavigate();

    if (!discipline) {
        navigate('/');
        return null;
    }

    return (
        <DisciplineComponent
            discipline={discipline}
            selectedSeason={selectedSeason}
            onBack={() => navigate('/')}
        />
    );
}
