import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { setRecoveryProps } from 'expo/build/ErrorRecovery/ErrorRecovery';

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card
        featuredTitle={dish.name}
        image={require('./images/uthappizza.png')}
      >
        <Text style={{ margin: 10 }}>{dish.description}</Text>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES
    };
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  render() {
    //this dishId is how we get access to the props parameter that we passed in by taking the parameter as an argument along with a fallback option
    const dishId = this.props.navigation.getParam('dishId', '');
    //the prop passed into render dish will be the dishId as an integer for the index. The plus sign below is strictly to change the type from string to integer
    // prettier-ignore
    return (<RenderDish dish={this.state.dishes[+dishId]} />);
  }
}

export default DishDetail;
