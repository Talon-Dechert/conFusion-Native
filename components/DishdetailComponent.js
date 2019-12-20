import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Modal,
  Button,
  Alert,
  PanResponder,
  Share
} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment))
});

const shareDish = (title, message, url) => {
  Share.share(
    {
      title: title,
      message: `${title}: ${message} ${url}`,
      url: url
    },
    {
      dialogTitle: 'Share ' + title
    }
  );
};

function RenderDish(props) {
  const dish = props.dish;

  handleViewRef = ref => (this.view = ref);

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) return true;
    else return false;
  };

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if (dx > 200) return true;
    else return false;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderGrant: () => {
      this.view
        .rubberBand(1000)
        .then(endState =>
          console.log(endState.finished ? 'finished' : 'cancelled')
        );
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log('pan responder end', gestureState);
      if (recognizeDrag(gestureState))
        Alert.alert(
          'Add Favorite',
          'Are you sure you wish to add ' + dish.name + ' to favorite?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => {
                props.favorite
                  ? console.log('Already favorite')
                  : props.onPress();
              }
            }
          ],
          { cancelable: false }
        );
      else if (recognizeComment(gestureState)) props.onShowModal();
      return true;
    }
  });

  if (dish != null) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={this.handleViewRef}
        {...panResponder.panHandlers}
      >
        <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={styles.cardRow}>
            <Icon
              raised
              reverse
              name={props.favorite ? 'heart' : 'heart-o'}
              type="font-awesome"
              color="#f50"
              onPress={() =>
                props.favorite
                  ? console.log('Already favorite')
                  : props.onPress()
              }
            />
            <Icon
              raised
              reverse
              style={styles.cardItem}
              name="pencil"
              type="font-awesome"
              color="#512DA8"
              onPress={() => props.onShowModal()}
            />
            <Icon
              raised
              reverse
              name="share"
              type="font-awesome"
              color="#512DA8"
              style={styles.cardItem}
              onPress={() =>
                shareDish(dish.name, dish.description, baseUrl + dish.image)
              }
            />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14, marginVertical: 5 }}>{item.comment}</Text>
        <Rating
          style={styles.rater}
          readonly
          imageSize={12}
          ratingCount={5}
          startingValue={+item.rating}
        />
        <Text style={{ fontSize: 12, marginVertical: 5 }}>
          {'-- ' + item.author + ', ' + item.date}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: '',
      comment: ''
    };
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(dishId) {
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
  }

  resetForm() {
    this.setState({
      showModal: false,
      rating: 5,
      author: '',
      comment: ''
    });
  }

  render() {
    //this dishId is how we get access to the props parameter that we passed in by taking the parameter as an argument along with a fallback option
    const dishId = this.props.navigation.getParam('dishId', '');
    //the prop passed into render dish will be the dishId as an integer for the index. The plus sign below is strictly to change the type from string to integer
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              ratingCount={5}
              startingValue={this.state.rating}
              onFinishRating={rating => this.setState({ rating: rating })}
            />
            <Input
              onChangeText={author => this.setState({ author: author })}
              placeholder="Author"
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              leftIconContainerStyle={{ paddingRight: 10 }}
            />
            <Input
              placeholder="Comment"
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={comment => this.setState({ comment: comment })}
            />
            <View style={{ marginTop: 20 }}>
              <Button
                color="#512DA8"
                onPress={() => {
                  this.handleComment(dishId);
                  this.resetForm();
                }}
                title="Submit"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Button
                onPress={() => this.resetForm()}
                color="gray"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  cardItem: {
    flex: 1,
    margin: 10
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  rater: {
    alignItems: 'flex-start',
    marginVertical: 5
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DishDetail);
