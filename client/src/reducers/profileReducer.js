const initialData = {
    name: '',
    number: '',
    img: ''
}


const profileReducer = (state=initialData,action) => {
    switch(action.type)
    {
        case 'ADD_PROFILE':{
            const {data} = action.payload;
            return {
                
                name: data[0],
                number: data[1],
                img: data[2]
            }
        }
        
            default: return state;
    }
    
}

export default profileReducer;