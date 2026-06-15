export const loadUser=()=>{
    try{
        return JSON.parse(localStorage.getItem('user'));

    }
    catch{
        return null
    }
}