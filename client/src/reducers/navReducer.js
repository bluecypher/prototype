const initialData = {
    prev: '',
    
}

const navReducer = (state = initialData, action)=>{
    switch (action.type) {
        case 'CHANGE_PREV': {
            const { page } = action.payload;
            return {

                prev: page,
                
                
            }
        }

        default: return state;
    }

}

export default navReducer;