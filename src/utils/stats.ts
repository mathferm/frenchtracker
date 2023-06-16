import axios from 'axios'
import configuration from '../../configuration.js'
//import { getNameForUuid } from './mojang'

async function currentprofile(data:any){
    if (data===undefined){
        return(1)
    }
    for (const key in data.profiles){
        if (data.profiles.hasOwnProperty(key)){
            const profile=data.profiles[key]
        if (profile.current==true){
            return(profile)
        }
    }}
    return(1)
}

export async function getskyblocklvl(name :string){
    const reponse=await axios.get("https://sky.shiiyu.moe/api/v2/profile/"+name).catch(()=>null)
    if (reponse==null){
        return("les requètes avec les apis n'ont pas fonctionné")
    }
    const reponsedata=reponse?.data
    const profit=await currentprofile(reponsedata)
    if (profit===1){
        return(configuration.messages.absencedeprofit)
    }
    return(profit.data.skyblock_level.level)
}

export async function getguild(name :string){
    const reponse=await axios.get("https://sky.shiiyu.moe/api/v2/profile/"+name).catch(()=>null)
    const reponsedata=reponse?.data
    const profit=await currentprofile(reponsedata)
    if (profit===1){
        return(configuration.messages.absencedeprofit)
    }
    if (profit.data.guild==undefined){
        return("Ce joueur n'a pas de guild")
    }
    else{
    return(profit.data.guild.name)}
}

export async function online(id:string){
    const player=await axios.get(configuration.API.hypixelapi+"status?uuid="+id+"&key="+configuration.API.hypixelkey)
    
    if (player.data.session.online==true){
        return("🟢 ")
    }
    else{
        return("🔴 Non-")
    }
}

export async function idtonamediscord(id:string) {
    const response=await axios.get('https://discord.com/api/v10/users/'+id,{
        headers:{
            Authorization: configuration.token,
        },
    })
    console.log(response.data)
    const user=response.data.username
    if (user==undefined){
        return("l'utilisateur n'existe pas")
    }
    else{
        return(user)
    }
}

export async function discordfromignmc(name:string){
    const reponse=await axios.get("https://sky.shiiyu.moe/api/v2/profile/"+name).catch(()=>null)
    const reponsedata=reponse?.data
    const profit=await currentprofile(reponsedata)
    if (profit===1){
        return(configuration.messages.absencedeprofit)
    }
    if (profit.data.social.DISCORD==undefined){
        return("Ce joueur n'a pas de discord enregistré")
    }
    else{
        return(profit.data.social.DISCORD)
    }
}
