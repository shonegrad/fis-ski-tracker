import { RaceCalendar } from '../components/RaceCalendar';
import { useAppContext } from '../context/AppContext';

export default function Races() {
    const { selectedSeason } = useAppContext();

    return (
        <RaceCalendar
            selectedSeason={selectedSeason}
            onRaceSelect={(race) => console.log('Selected race:', race)}
        />
    );
}
