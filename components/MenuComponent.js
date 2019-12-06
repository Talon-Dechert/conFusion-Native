import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, Tile } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

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
        <Tile
          title={item.name}
          caption={item.description}
          featured
          //the navigate here allows for navigation to a new component, the following object contains the props to be sent into that component
          onPress={() => navigate('DishDetail', { dishId: item.id })}
          imageSrc={{ uri: baseUrl + item.image }}
        />
      );
    };

    return (
      <FlatList
        data={this.props.dishes.dishes}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
      />
    );
  }
}

export default connect(mapStateToProps)(Menu);
