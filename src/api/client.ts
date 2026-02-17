const API_BASE_UEL = import.meta.env.VITE_REACT_APP_BASE_URL_API;

export async function api<T>(path:string,options:RequestInit):Promise<T>{
    const res = await fetch(`${API_BASE_UEL}/${path}`,{
        headers:{"Content-Type":"application/json"},
        ...options
    })

    if (!res.ok){
        throw new Error(`API Error: ${res.status}`)
    }

    return res.json()
}

export async function GET<T>(path:string,options:RequestInit):Promise<T>{
    return api(path,options)
}
export async function POST<T>(path:string,body:object,options:RequestInit):Promise<T>{
    return api(path,{...options,method:"POST",body:JSON.stringify(body)})
}
export async function PATCH<T>(path:string,body:object,options:RequestInit):Promise<T>{
    return api(path,{...options,method:"PATCH",body:JSON.stringify(body)})
}