import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { ListItem, Text, Avatar } from 'react-native-elements';

/* Class screen for showing the word bank and words that popped up */
export default class ClassScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const channel = navigation.getParam('channel');
    this.state = {
      words: [],
      currentWord: {},
      imgWidth: 0,
      imgHeight: 0
    };

    channel.watch(wordSaid => {
      const { name } = wordSaid;
      /* eslint-disable */
      let words = [...this.state.words];
      /* eslint-enable */
      const word = words.find(w => w.name === name) || {
        ...wordSaid,
        count: 0
      };
      word.count += 1;
      words = words.filter(w => w.name !== name);
      words.unshift(word);
      this.setState({ words });
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.addListener('didFocus', () => navigation.getParam('callback')());
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.getParam('channel').unsubscribe();
  }

  selectWord = word => this.setState({ currentWord: word });

  render() {
    const { words } = this.state || [];
    const { currentWord } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flex: 0.46,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              width: '90%',
              height: '90%'
            }}
            source={{
              uri:
                currentWord.image && currentWord.image.url
                  ? currentWord.image.url
                  : null
            }}
          />
        </View>
        <View
          style={{
            flex: 0.14,
            borderColor: 'gray',
            borderBottomWidth: 1
          }}
        >
          <Text>
            <Text
              h3
              style={{ color: 'black', textDecorationLine: 'underline' }}
            >
              {'Definition:'}
            </Text>
            <Text h4 style={{ color: 'black' }}>
              {currentWord.definition ? ` ${currentWord.definition}` : null}
            </Text>
          </Text>
        </View>

        <View style={{ flex: 0.4 }}>
          <ScrollView>
            {words.length > 0 &&
              words.map(word => (
                <View key={word.name}>
                  <ListItem
                    title={word.name}
                    subtitle={word.definition}
                    style={{ backgroundColor: '#fff' }}
                    avatar={
                      word.image &&
                      word.image.url && (
                        <Avatar medium source={{ uri: word.image.url }} />
                      )
                    }
                    titleStyle={{
                      color: currentWord.name === word.name ? 'red' : 'black',
                      fontSize: 32
                    }}
                    rightTitleStyle={{
                      color: 'black',
                      fontSize: 24
                    }}
                    hideChevron
                    onPress={() => this.selectWord(word)}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}
