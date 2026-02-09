import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDownloads, startDownloadTrack } from "./api";


export function useFetchDownloads(){
    return useQuery({
        queryKey:['downloads'],
        queryFn:fetchDownloads
    })
}

export function useStartDownloadTrack(playlistID: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackID: number) =>
      startDownloadTrack(trackID),
    onSuccess:(data,trackID)=>{
        queryClient.setQueryData(['playlist-tracks',playlistID],(cache)=>( 
            cache.map((cacheItem)=>cacheItem.id==trackID ? {...cacheItem,download:data} : cacheItem)
        ))
        return data
    }
  });
}

