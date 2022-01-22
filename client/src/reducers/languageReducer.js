const initialData = {
    language: '',
    
}

const languageReducer = (state = initialData, action)=>{
    switch (action.type) {
        case 'CHANGE_LANGUAGE': {
            const { lang } = action.payload;
            return {

                language: lang,
                
                
            }
        }

        default: return state;
    }

}

export default languageReducer;