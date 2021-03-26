import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { windowHeight } from '../../utils/Dimentions';


const User = (props) => {
    const { Name, Age, member_id, pictureUrl } = props.user;

    return (
        <View style={styles.userContainer}>

            <Avatar

                size='medium'
                containerStyle={{ marginTop: 10 }}
                rounded
                source={{
                    uri:
                        pictureUrl,
                }}
            />
            <View style={{ marginTop: windowHeight / 50, marginLeft: windowHeight / 100 }}>
                <Text>{Name}, {Age}</Text>
            </View>
        </View>
    )
}

export default User

const styles = StyleSheet.create({

    userContainer: {
        flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 100
    }
})
