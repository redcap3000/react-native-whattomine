/**
 * What to Mine App
 * Based on Sample React Native App 
 * httpss://github.com/facebook/react-native
 * @flow
 *
 * Adds Integration with sortable list component, and fetch (built in) for json data.
 * Packaged for development on Expo.
 * https://expo.io/
 * @redcap3000 2018
 * 
 */

import React, { Component } from 'react';

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import SortableList from 'react-native-sortable-list';

const window = Dimensions.get('window');

// these icons are sort of ok, the url path is generated via ID
const abnormalIcons = {
	'ETC' : "etc3",
	'INN' : 'innova',
	'EXP' : 'exp2',
	'HUSH' : 'hush2',
	'ZEN' : 'zen2',
	'HAL' : 'hal3',
	'SUMO' : 'sumo2',
	'XMR' : 'monero',
	'SIB' : 'sib2',
	'BWK' : 'bwk3',
	'XVG' : 'xvg2',
	'DCR' : 'dcr3',
	'XDN' : 'xdn4',
	'LBC' : 'lbc2'
}

// these icons are not normal manually linking them

const manualLinkedIcons = {
	'FTC' : 'https://images.whattomine.com/coins/logos/000/000/008/thumb/feathercoin_logo_256px.png',
	'GRS' : 'https://images.whattomine.com/coins/logos/000/000/048/thumb/grs3.png',
	'PXC' : 'https://images.whattomine.com/coins/logos/000/000/071/thumb/pxc.png',
	'VTC' : 'https://images.whattomine.com/coins/logos/000/000/005/thumb/vtc2.png'
}
export default class Basic extends Component {
  constructor (props) {
    super(props);
	this.state ={ isLoading: true}
  }
  
  componentDidMount(){
    return fetch('https://whattomine.com/coins.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          gpuCoins: responseJson.coins,
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  render() {
  	let data = []
  	if(!this.state.isLoading){
  		let gpuCoins = this.state.gpuCoins
  		for(let k in gpuCoins){
  			let coin = gpuCoins[k]
  			if(coin.tag != 'NICEHASH'){
	  			// add image and text to adhere to original example
	  			if(typeof abnormalIcons[coin.tag] != 'undefined'){
	  				coin.image = 'https://images.whattomine.com/coins/logos/000/000/'+coin.id+'/thumb/'+ abnormalIcons[coin.tag] + '.png'
	  			}else if(typeof manualLinkedIcons[coin.tag] != 'undefined') {
	  				coin.image = manualLinkedIcons[coin.tag]
	  			}else{
	  				coin.image = 'https://images.whattomine.com/coins/logos/000/000/'+coin.id+'/thumb/'+coin.tag.toLowerCase()+'.png'
	  			}
	  			coin.text = k
	  			data.push(coin)
  			}
  		}
  	}else{
     data = {
	  0: {
	    image: 'https://images.whattomine.com/coins/logos/000/000/001/thumb/btclogo.png',
	    text: 'Loading....',
	  }
	  };
	}
    return (
      <View style={styles.container}>
        <Text style={styles.title}>What To mine</Text>
        <SortableList
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          data={data}
          renderRow={this._renderRow} />
      </View>
    );
  }

  _renderRow = ({data, active}) => {
    return <Row data={data} active={active} />
  }
}

class Row extends Component {

  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const {data, active} = this.props;
    return (
      <Animated.View style={[
        styles.row,
        this._style,
      ]}>
      	{(typeof data.image != 'undefined' && data.image != '' 
      		? 
      		(
	        	<Image 
	        		source={{uri: data.image}} 
	        		style={styles.image} 
	        	/>
	        )
      		:
      		false)
      	}
        <Text style={styles.text}> 
        	{(typeof data.tag != 'undefined' ? data.profitability : data.text)} 
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: '#999999',
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    width: window.width,
    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },
      android: {
        paddingHorizontal: 0,
      }
    })
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    height: 80,
    flex: 1,
    marginTop: 7,
    marginBottom: 12,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },
      android: {
        width: window.width - 30 * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    })
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },
  text: {
    fontSize: 24,
    color: '#222222',
  },
});