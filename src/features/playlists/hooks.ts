
import { fetchPlaylist, fetchPlaylists, fetchPlaylistTracks,syncPlaylists,syncPlaylistTracks } from "./api"
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function usePlaylists(){
    return useQuery(
        {
            queryKey:["playlists"],
            queryFn:fetchPlaylists
        }
    )

}

export function usePlaylist(id:number){
    return useQuery({
        queryKey:["playlist",id],
        queryFn:()=> fetchPlaylist(id)
    })
}

export function usePlaylistTracks(playlistID:number){

    return useQuery(
        {
        queryKey:["playlist-tracks",playlistID],
        queryFn:()=> fetchPlaylistTracks(playlistID),
        enabled: !!playlistID,
        refetchOnWindowFocus:false,
    })
}
   
export function useSyncPlaylistTracks(playlistID:number){
    const queryClient = useQueryClient();
    
    const mutation =  useMutation(
        {
            mutationFn:()=> syncPlaylistTracks(playlistID),
            onSuccess:()=> queryClient.invalidateQueries(
                {queryKey:["playlist-tracks",playlistID]}
            )
        }
    )
    return {
        syncing:mutation.mutate,
        syncingData:mutation.data,
        syncingIsLoading:mutation.isPending,
        syncingError:mutation.isError,
        syncingSuccess:mutation.isSuccess,
    }
}
export function useSyncPlaylists(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:()=> syncPlaylists(),
        onSuccess: ()=> queryClient.invalidateQueries({queryKey:['playlists']})
    })

    return {
        syncing:mutation.mutate,
        syncingData:mutation.data,
        syncingIsLoading:mutation.isPending,
        syncingError:mutation.isError,
        syncingSuccess:mutation.isSuccess,
    }
}