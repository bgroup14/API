import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Button } from 'react-native';

import { login } from '../../store/actions/auth';


const Login = () => {

    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const check = () => {
        dispatch(login("fudck"))
    }
    return (
        <View>
            <Text>login page</Text>
            <Text>{user}</Text>
            <Button title="add one" onPress={() => check()} />
        </View>
    )
}

export default Login
