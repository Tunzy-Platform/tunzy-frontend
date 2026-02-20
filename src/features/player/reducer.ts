
import { DownloadStatusEnum } from "../downloads/types";
import type { PlayerAction, PlayerStore } from "./types";
import { shuffle } from "@/utils";

export function playerReducer(state:PlayerStore,action:PlayerAction){
    switch (action.type){
        case "PlayingTrack":{
            const trackIndex = action.queue.findIndex((i)=>i.id==action.trackID)
            return {
                ...state,
                PlaylistID:action.playlistID,
                queue:action.queue,
                currentIndex:trackIndex,
                trackIndex:trackIndex,
            }
        }

        case "BuildPlayback":{
            const indexes = state?.queue?.map((_,i)=>i)
            let playback;
           
            if(state?.isShuffle){
                playback = shuffle(indexes || [])
            }
            else{
                playback = shuffle(indexes || [])
            }
            return {
                ...state,
                playback:playback
            }
        }
        case "StartPlaying": {
  
            return {...state,
                isPlaying:true
            }
        }
        case "NextTrack":{
            const currentIndex = state?.currentIndex   || 0
            
            const newTrackIndex = state.queue.findIndex((track,i)=> track.download?.status == DownloadStatusEnum.Successful && i > currentIndex,)

            if (newTrackIndex  >= state.queue.length || newTrackIndex == -1){
                    return state
            }

            return {...state,
                isPlaying:true,
                currentIndex : newTrackIndex || currentIndex
            }
        }
        case "PreviousTrack":{
            const currentIndex = state?.currentIndex   || 0
            let newTrackIndex ;
            
            for( let index=currentIndex - 1; index >= -1 ;index--){
              
                if(index == -1){
                    newTrackIndex = null
                    break
                }
                if(state.queue[index].download?.status == DownloadStatusEnum.Successful){
                    newTrackIndex = index;
                    break;
                }
            }

            return {...state,
                isPlaying:true,
                currentIndex : newTrackIndex != null? newTrackIndex : currentIndex
            }
        }
    }

}