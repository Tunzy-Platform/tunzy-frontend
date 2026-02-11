import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelDownloadTrack, fetchDownloads, startDownloadTrack } from "./api";
import type { PlaylistTrackType } from "@/types/types";
import type { DownloadTrack } from "./types";


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
    onSuccess:(_,downloadID)=>{
      queryClient.cancelQueries({queryKey:['downloads']})
      queryClient.setQueryData<DownloadTrack[]>(['downloads'],(items)=>{
        if(!items) return;
          return items.filter((item)=> downloadID != item.id)
      })
    },
  })
}
