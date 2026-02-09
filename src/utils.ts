
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
