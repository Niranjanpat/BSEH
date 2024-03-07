import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {IMAGE} from '../../constants/images';

const AboutPalanjali = ({navigation}) => (
  <ScrollView style={{backgroundColor: '#ebeef3'}}>
    <Appbar.Header>
      <Appbar.BackAction
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Appbar.Content title="About Patanjali" />
    </Appbar.Header>

    <View
      style={{
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'center',
      }}>
      <View
        style={{
          elevation: 1,
          width: '95%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 5,
        }}>
        <View>
          <Image
            style={{height: 60, width: 127, marginBottom: 10}}
            source={IMAGE.logo}
          />
        </View>
        <View>
          <Text style={{color: '#9c3a36', fontSize: 16, marginTop: 10}}>
            About Patanjali
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,

            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#fff',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '100%',
                paddingTop: 20,
                paddingLeft: 20,
                flexDirection: 'row',
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
              }}>
              <Image
                style={{width: 80, height: 60, marginRight: 10}}
                source={IMAGE.ramdev}
              />
              <Text>Yogshi Swami Ramdev Ji</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              elevation: 2,
              backgroundColor: '#fff',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '100%',
                paddingTop: 20,
                paddingLeft: 20,
                flexDirection: 'row',
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
              }}>
              <Image
                style={{width: 80, height: 60, marginRight: 10}}
                source={IMAGE.bal}
              />
              <Text>Vaidyaraj Acharya Balkrishna Ji</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#ff8201',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              flex: 1,

              marginRight: 10,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Divya yog Mandir (trust)</Text>
            </View>
          </View>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#ff8201',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              marginLeft: 10,
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Patanjali Yogpeeth(trust)</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#aec91c',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              flex: 1,

              marginRight: 10,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Patanjali Gramodhyog (trust)</Text>
            </View>
          </View>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#aec91c',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              marginLeft: 10,
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>
                Patanjali research foundation (trust)
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#ff8201',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              flex: 1,

              marginRight: 10,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Bharat Swabhiman (trust)</Text>
            </View>
          </View>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#FF8201',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              marginLeft: 10,
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Patanjali Ayurved</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#aec91c',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              flex: 1,

              marginRight: 10,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Patanjali Vishwavidyalaya</Text>
            </View>
          </View>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#aec91c',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              marginLeft: 10,
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Yog gram</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#ff8102',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              flex: 1,
              marginRight: 10,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Patanjali Chikitsalaya</Text>
            </View>
          </View>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#ff8102',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              marginLeft: 10,
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Arogya Kendra</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#aec91c',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              flex: 1,
              marginRight: 10,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Divya Prakshan</Text>
            </View>
          </View>
          <View
            style={{
              elevation: 2,
              backgroundColor: '#aec91c',
              shadowOpacity: 0.1,
              width: '100%',
              borderRadius: 3,
              flexDirection: 'row',
              marginLeft: 10,
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.iconText}>Yog Sandesh</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
);

export default AboutPalanjali;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    color: '#fff',
    backgroundColor: '#ff1f77',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    borderRadius: 20,
    paddingBottom: 10,
  },
  inputContainer: {
    marginTop: 5,
    borderWidth: 1.5,
    borderColor: '#dbdbdb',
    backgroundColor: '#ffffff',

    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  inputContainerTopWrapper: {
    flexDirection: 'row',
  },
  inputContainerTopLeft: {
    marginTop: 5,
    borderWidth: 1.5,
    borderColor: '#dbdbdb',
    backgroundColor: '#ffffff',
    width: '80%',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  inputContainerTopRight: {
    marginTop: 5,
    borderWidth: 1.5,
    borderColor: '#dbdbdb',
    backgroundColor: '#ffffff',
    width: '20%',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
});
