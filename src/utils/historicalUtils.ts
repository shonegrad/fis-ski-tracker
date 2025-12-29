export const calculatePercentage = (value: number, total: number): string => {
  return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
};

export const getDisciplinePerformanceData = (disciplineData: { races: number; wins: number; podiums: number }) => {
  const winRate = calculatePercentage(disciplineData.wins, disciplineData.races);
  const podiumRate = calculatePercentage(disciplineData.podiums, disciplineData.races);
  
  return {
    winRate,
    podiumRate,
    otherResults: disciplineData.races - disciplineData.podiums
  };
};