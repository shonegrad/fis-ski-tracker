import { LocationList } from '../components/LocationList';
import { useAppContext } from '../context/AppContext';

export default function Locations() {
    const { selectedSeason } = useAppContext();

    return <LocationList selectedSeason={selectedSeason} />;
}
