
import type { PlayerAction, PlayerStore } from "./types";
import { shuffle } from "@/utils";
import { RepeatModes } from "./types";
import { DownloadStatusEnum } from "@/types/types";
export function playerReducer(state:PlayerStore,action:PlayerAction){
    switch (action.type){
        
        case "PlayingTrack":{
            const trackIndex = action.queue.findIndex((i)=>i.id==action.trackID)
            let currentIndex = 0
            
            if(state.playback.length !=0 && state.playlistID == action.playlistID){
                currentIndex = state.playback.findIndex((i)=> i==trackIndex)
            }

            return {
                ...state,
                playlistID:action.playlistID,
                queue:action.queue,
                trackIndex:trackIndex,
                currentIndex:currentIndex
            }
        }

        case "RefreshQueue":{
            console.log("RefreshQueue")
            return {...state,queue:action.queue}
        }
        
        case "ToggleShuffle":{
            return {...state,isShuffle:!state.isShuffle}
        }
        
        case "ToggleRepeatMode":{
            
            const repeatModeIndex = (RepeatModes.indexOf(state.repeatMode) + 1) % (RepeatModes.length )
            return {...state,repeatMode:RepeatModes[repeatModeIndex]}
        }

        case "BuildPlayback":{
            const indexes = state?.queue?.map((_,i)=>i)
            let playback = indexes;

            if(action.shuffle){
                playback = [state.currentIndex || 0,...shuffle(indexes.filter((i)=>i!=state.currentIndex))]
            }
            
            // find the current track position inside new playback
            const currentIndex = state.trackIndex != -1 ? playback.findIndex((i)=> i == state.trackIndex) : null

            return {...state,
                isShuffle:action.shuffle,
                playback:playback,
                currentIndex:currentIndex
            }
        }

        case "StartPlaying": {
            return {...state,
                isPlaying:true
            }
        }

        case "NextTrack":{
 
            if(state.repeatMode == "one"){
                return state
            }

            const currentIndex = state?.currentIndex   || 0
            let newCurrentIndex  = currentIndex;
            let trackIndex = state.trackIndex

            let newIndex = currentIndex + 1
            while(newIndex != currentIndex)
            {
                
                // after reach end of playback queue stop iterating
                if(state.repeatMode == "off" && newIndex >= state.playback.length - 1 ){
                    break
                }
                

                const currentTrackIndex = state.playback[newIndex]
                if(state.queue[currentTrackIndex].download?.status === DownloadStatusEnum.Successful){
                    newCurrentIndex=newIndex
                    trackIndex = state.playback[newIndex]
                    break
                }
                // circular playback on mode `all`
                if(state.repeatMode == "all"){
                    newIndex = (newIndex +1) % state.playback.length
                }
                else{
                    newIndex++;
                }
            }

            console.log("play stats",newCurrentIndex!=state.currentIndex ? true : false)

            return {...state,
                isPlaying: newCurrentIndex!=state.currentIndex ? true : false,
                currentIndex : newCurrentIndex,
                trackIndex:trackIndex
            }
        }

        case "PreviousTrack":{
            if(state.repeatMode == "one"){
                return {...state, isPlaying:true}
            }

            const currentIndex = state?.currentIndex   || 0
            let newCurrentIndex = currentIndex;
            let trackIndex = state.trackIndex

            let newIndex = currentIndex-1
            while(newIndex != currentIndex)
            {     
                // after reach end of playback queue stop iterating
                if(state.repeatMode == "off" && newIndex < 0 ){
                    break
                }

                const currentTrackIndex = state.playback[newIndex]
                if(newIndex >=0 && state.queue[currentTrackIndex].download?.status === DownloadStatusEnum.Successful){
                    newCurrentIndex=newIndex
                    trackIndex = state.playback[newIndex]
                    break
                }
                // circular playback on mode `all`
                if(state.repeatMode == "all"){
                    newIndex = newIndex-1 < 0 ? state.playback.length -1 : newIndex -1
                }
                else{
                    newIndex--;
                }
            }
            return {...state,
                isPlaying:true,
                currentIndex : newCurrentIndex,
                trackIndex:trackIndex,
            }
        }
    }

}