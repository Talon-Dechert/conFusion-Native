import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { Loading } from './LoadingComponent';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes
  };
};

class Menu extends Component {
  //this sets the title of the page in the status bar for react-navigation
  static navigationOptions = {
    title: 'Menu'
  };

  render() {
    const { navigate } = this.props.navigation;

    const renderMenuItem = ({ item, index }) => {
      return (
        <Animatable.View animation="fadeInRightBig" duration={2000}>
          <Tile
            title={item.name}
            caption={item.description}
            featured
            //the navigate here allows for navigation to a new component, the following object contains the props to be sent into that component
            onPress={() => navigate('DishDetail', { dishId: item.id })}
            imageSrc={{ uri: baseUrl + item.image }}
          />
        </Animatable.View>
      );
    };

    if (this.props.dishes.isLoading) {
      return <Loading />;
    } else if (this.props.dishes.errMess) {
      return (
        <View>
          <Text>{this.props.dishes.errMess}</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={this.props.dishes.dishes}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id.toString()}
        />
      );
    }
  }
}

export default connect(mapStateToProps)(Menu);
