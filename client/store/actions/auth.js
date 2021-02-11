
import LOGIN_SUCCESS from './types';
//Login User
export const login = (email, password) => {

    return {

        type: "LOGIN_SUCCESS",
        payload: email
    }

    //For async to work in dispatch i should add thunk redux
    // const url = "https://jsonplaceholder.typicode.com/todos/1"
    // const settings = {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     //body: JSON.stringify(data)
    // };
    // try {
    //     console.log("trying...")
    //     const fetchResponse = await fetch(url, settings);
    //     // console.log("tryy")
    //     console.log(fetchResponse)
    //     const data = await fetchResponse.json();
    //     console.log(data)
    //     console.log("succesful dispaching")

    //     return {

    //         type: "LOGIN_SUCCESS",
    //         payload: email
    //     }

    // } catch (e) {
    //     console.log("err")
    //     return e;
    // }





    //IF STATUS IS 200 else will be error and go to catch


}

