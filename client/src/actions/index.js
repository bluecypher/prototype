export const addProfile=(data)=>({
         
    type: "ADD_PROFILE",
    payload: {
        data
    }
});

export const deleteProfile=()=>({
         
    type: "DELETE_PROFILE"
    
});

export const changePrev=(page)=>({
         
    type: "CHANGE_PREV",
    payload: {
        page
    }
    
});

// export const changeLanguage=(lang)=>({
         
//     type: "CHANGE_LANGUAGE",
//     payload: {
//         lang
//     }
// });

// export const deleteProfile=()=>({
         
//     type: "DELETE_PROFILE",
    
// });
