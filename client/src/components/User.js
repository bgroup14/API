import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight } from '../../utils/Dimentions';


const User = (props) => {
    const { fullName, memberId, pictureUrl } = props.user;
    // console.log("user derails are: " + fullName)

    return (
        <TouchableOpacity onPress={() => props.goToOtherUserProfile(memberId)}>

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
                <View style={{ marginTop: windowHeight / 40, marginLeft: windowHeight / 100 }}>
                    <Text style={{ fontSize: 16 }}>{fullName}</Text>
                </View>
            </View>
        </TouchableOpacity>

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
