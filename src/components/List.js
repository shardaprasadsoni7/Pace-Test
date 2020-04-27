// components/List.js

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import database from '@react-native-firebase/database';

class List extends Component {
  state = {
    data : [],
  }
  componentDidMount() {
    database()
    .ref('/users')
    .on('value', snapshot => {
      let arr = [];
      let obj = snapshot.val();
      for (let i in obj) {
        arr.push(obj[i]);
      }
      this.setState({data: arr});
      console.log(this.state.data);
    });
  }

  renderRowItem = ({item}) => {
    console.log(item)
    return (
      <TouchableOpacity
        onPress={() => Actions.detail({item})}
        style={[
          styles.item,
          { backgroundColor: '#f9c2ff' },
        ]}
      >
        <Text style={styles.title}>{item.name+" : "+item.email}</Text>
      </TouchableOpacity>
    );
  }

  render () {
    console.log(this.props.scene)
    return (
      <View style={styles.outerContainer}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderRowItem}
          keyExtractor={item => item.id}
          extraData={this.state.data}
        />

      </View>

    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,    
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
})

function mapStateToProps(state) {
    const {scene} = state.routes;
    return {
       scene
    }
}

export default connect(mapStateToProps)(List);