const initialData = {
    fname: '',
    lname: '',
    number: '',
    img: '',
    email: '',
    add1: '',
    add2: '',
    city: '',
    pin: '',
    state: '',
    locality: '',
    hghlts: '',
    ent: '',
    id: '',
    user_type: '',
    qr_code: '',
    entLogo: '',
    vpa: '',
    ent_id: '',
}


const profileReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'ADD_PROFILE': {
            const { data } = action.payload;
            return {
                ...state,
                fname: data[0],
                lname: data[1],
                number: data[2],
                img: data[3],
                email: data[4],
                add1: data[5],
                add2: data[6],
                city: data[7],
                pin: data[8],
                state: data[9],
                locality: data[10],
                hghlts: data[11],
                ent: data[12],
                id: data[13],
                user_type: data[14],
                entLogo: data[15],
                ent_id: data[16],
                vpa: data[17],
            }
        }
        case 'DELETE_PROFILE': {
            return {

                fname: '',
                lname: '',
                number: '',
                img: '',
                email: '',
                add1: '',
                add2: '',
                city: '',
                pin: '',
                state: '',
                locality: '',
                hghlts: '',
                ent: '',
                id: '',
                user_type: '',
                qr_code: '',
                entLogo: '',
                vpa: '',
                ent_id: '',
            }
        }
        case 'ADD_VPA': {
            const { data } = action.payload;
            return {
                ...state,
                vpa: data,
            }

        }

        default: return state;
    }

}

export default profileReducer;