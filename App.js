import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Image
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const ITEMS = [
  {id: '1', uri: require('./assets/1.jpg'), name: 'image 1'},
  {id: '2', uri: require('./assets/2.jpg'), name: 'image 2'},
  {id: '3', uri: require('./assets/3.jpg'), name: 'image 3'},
  {id: '4', uri: require('./assets/4.jpg'), name: 'image 4'}
]



class App extends Component {
  constructor() {
    super()

    this.state = {
      currentIndex : 0
    }

    this.position = new Animated.ValueXY()

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0.9, 1],
      extrapolate: 'clamp'
    })
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (event, gestureState) => {
        // right swipe
        if(gestureState.dx > 120){
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              //pass our custom swipe right function here
              this.position.setValue({ x: 0, y: 0 })
            })
          })
          // left swipe
        } else if(gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              //pass our custom swipe left function here
              this.position.setValue({ x: 0, y: 0 })
            })
          })
          // swipe incomplete
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  renderUsers = () => {
    return ITEMS.map((item, i) => {
      if(i < this.state.currentIndex){
        return null
      } else if (i == this.state.currentIndex) {
        //this is the top card, display it and animate it
        return(
          <Animated.View 
          {...this.PanResponder.panHandlers}
          key={item.id} 
          style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH , padding: 10, position: 'absolute'}]}>

            <Animated.View style={[{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }] }, { position: 'absolute', top: 50, left: 45, zIndex: 1000 }]}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800' }}>FOOBEE</Text>
            </Animated.View>

            <Image source={item.uri}
            style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }} />

            <Animated.View style={[{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }] }, { position: 'absolute', top: 50, right: 45, zIndex: 1000 }]}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800' }}>NOPE</Text>
            </Animated.View>

          </Animated.View>
        )
      } else {
        //not the top card don't animate
        return(
          <Animated.View 
          key={item.id} 
          style={[{ opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }] }, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH , padding: 10, position: 'absolute'}]}>
            <Image source={item.uri}
            style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }} />
          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}></View>
        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>
        <View style={{ height: 60 }}></View>
      </View>
    );
  }
}

export default App