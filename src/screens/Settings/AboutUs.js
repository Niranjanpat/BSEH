import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Caption,
  List,
  Paragraph,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {IMAGE} from '../../constants/images';
import {COLORS} from '../../constants/theme/colors';

const AboutUs = ({navigation}) => {
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => setExpanded(!expanded);
  return (
    <ScrollView style={styles.container}>
      <Appbar.Header theme={{colors: {primary: COLORS.light}}}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="About Us" />
      </Appbar.Header>
      <Image source={IMAGE.bharuwa} style={styles.image} />
      <Caption style={{textAlign: 'center', margin: 10}}>
        Bharuwa IT Company is endowed to bring forth the treasured advantages of
        products made in India with Swadeshi Spirit.
      </Caption>
      <View style={styles.contain}>
        <Title>About Bharuwa Solution</Title>
        <Subheading>Quality | Time | Technology | Innovation</Subheading>
        <Caption style={{textAlign: 'center'}}>
          Bharuwa is a Trusted Swadeshi Brand offer IT Services & Solutions with
        </Caption>
        <Paragraph style={{textAlign: 'justify'}}>
          Bharuwa Solution is a highly innovative IT Service & Software
          Development company based in Haridwar. Established in 2019 with
          “Swadeshi Spirit” to provide digital innovations for businesses in the
          “Indian Information Technology Industry” - through total customer
          satisfaction. We are pioneer in providing superior and world standard
          based IT solutions for small to large corporate companies,
          Organizations and Government. We are leading, highly innovative
          software house, systems integrator and technology provider,
          established to provide leading edge intelligent technical solutions
          services to businesses, organizations and government in order to allow
          the efficient and effective secure access and communication with
          various heterogeneous information resources and services, anytime and
          anywhere.
        </Paragraph>
        {expanded && (
          <Paragraph style={{textAlign: 'justify'}}>
            We also have special expertise in Software development – providing
            specialized products, IT services and custom end to end solutions to
            our customer enterprise. We gain competitive advantage from these
            distinctive capabilities and have developed the ability to implement
            and manage complex IT systems in changing times with greater
            effectiveness than many competitors. In the last 2 years Bharuwa has
            provided its services to a large customer base in all over the
            country, offering considerably lower priced services than Industry
            norms
          </Paragraph>
        )}
        <Button icon={expanded ? 'menu-up' : 'menu-down'} onPress={handlePress}>
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
        <List.Section style={{width: '100%'}}>
          <List.Accordion
            style={{backgroundColor: '#fff'}}
            title="VISION"
            left={props => (
              <List.Icon {...props} icon="television-ambient-light" />
            )}>
            <Text>
              Our vision to enable “Secure access to any Service, data and
              information anytime, anywhere”, providing its client and business
              partners with robust, extensible and customizable
              security-enhanced solutions.
            </Text>
          </List.Accordion>
          <List.Accordion
            style={{backgroundColor: '#fff'}}
            title="MISSION"
            left={props => <List.Icon {...props} icon="bullseye-arrow" />}>
            <Text>
              Our mission is to provide innovative, configurable, flexible,
              cost-effective solutions to common business challenges, enabling
              our clients to save time, increase productivity, minimize costs,
              and maximize their return on investment
            </Text>
          </List.Accordion>
          <List.Accordion
            style={{backgroundColor: '#fff'}}
            title="OBJECTIVE"
            left={props => <List.Icon {...props} icon="license" />}>
            <Text>
              To provide efficient and cost-effective solutions to complex
              information management requirements through innovative application
              of the latest in technology and nurture them towards identifying
              the organisation’s goals as their personal targets.
            </Text>
          </List.Accordion>
        </List.Section>
      </View>
    </ScrollView>
  );
};

export default AboutUs;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 100,
    width: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  contain: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
});
