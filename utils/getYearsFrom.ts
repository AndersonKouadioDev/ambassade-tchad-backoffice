
export function getYearsFromDateToNow(startYear: number): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
    }
    
    return years;
}