import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';



const Confetti = () => {
    useEffect(() => {
        animation.current.play(0, 59)
    }, [])
    const animation = React.useRef(null)
    return (
        <LottieView style={styles.lottie}
            ref={animation}
            source={require('../../assets/lottie/14162-taras-chenenko-succcess-confetti.json')}
            autoPlay={false}
            loop={false} />
    )
}

export default Confetti

const styles = StyleSheet.create({
    lottie: {
        width: 400,
        height: 400,
        zIndex: 1, position: 'absolute', bottom: windowHeight / 8, right: - (windowHeight / 130)

    }
})
