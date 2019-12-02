import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES
    };
  }

  //this sets the title of the page in the status bar for react-navigation
  static navigationOptions = {
    title: 'Menu'
  };

  render() {
    const { navigate } = this.props.navigation;

    const renderMenuItem = ({ item, index }) => {
      return (
        <ListItem
          key={index}
          title={item.name}
          subtitle={item.description}
          //the navigate here allows for navigation to a new component, the following object contains the props to be sent into that component
          onPress={() => navigate('DishDetail', { dishId: item.id })}
          leftAvatar={{ source: require('./images/uthappizza.png') }}
        />
      );
    };

    return (
      <FlatList
        data={this.state.dishes}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
      />
    );
  }
}

export default Menu;
