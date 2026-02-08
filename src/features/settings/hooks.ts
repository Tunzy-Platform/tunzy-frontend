import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSettings, updateSetting } from "./api";
import type { SettingsType } from "./types";

export function useUpdateSettings(){
    const mutation = useMutation({
        mutationFn:(data:SettingsType)=> updateSetting(data),
    })
    return mutation
}
export function useFetchSettings(){
    return useQuery({
        queryKey:["settings"],
        queryFn:()=>fetchSettings(),
        staleTime:Infinity
    })
}