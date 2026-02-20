
export function convertDurationToTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const sec = seconds % 60
    const min = Math.floor(seconds / 60) % 60
    const hour = Math.floor(seconds / 3600)
    let time = `${min}:${sec}`
    if(hour){
        time = `${hour}:${time}`
    }
    return time
}
export function shuffle(array:number[]) {
  // We make a copy so we don't modify the original array
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}