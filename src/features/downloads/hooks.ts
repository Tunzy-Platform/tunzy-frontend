import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelDownloadTrack, fetchDownloads, startDownloadTrack } from "./api";
import type { PlaylistTrackType } from "@/types/types";


export function useFetchDownloads(){
    return useQuery({
        queryKey:['downloads'],
        queryFn:fetchDownloads,
        retry:false
    })
}

export function useStartDownloadTrack(playlistID: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackID: number) =>
      startDownloadTrack(trackID),
    onSuccess:(data,trackID)=>{
        queryClient.setQueryData(['playlist-tracks',playlistID],(cache:PlaylistTrackType[])=>( 
            cache.map((cacheItem)=>cacheItem.id==trackID ? {...cacheItem,download:data} : cacheItem)
        ))
        return data
    }
  });
}


export function useCancelDownloadTrack(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (downloadID:number)=> cancelDownloadTrack(downloadID),
    onSuccess:()=> queryClient.invalidateQueries({queryKey:['downloads']})
  })
}
