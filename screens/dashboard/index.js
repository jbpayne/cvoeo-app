// @flow

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
  Animated,
  ART,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerItems } from 'react-navigation';
import * as dataSource from '../../data-sources/firebase-data';
import moment from 'moment';
import { Svg } from 'expo';

// import global actions
import * as actions from './actions';

// import global styles
// @TODO: move the global styles from this screen into ../../styles/common 
import commonStyles from '../../styles/common';
const styles = StyleSheet.create(commonStyles);

const {
  Surface,
  Group,
  Shape,
} = ART;

type Props = {
  actions: Object,
  profile: Object,
  navigation: Object
};


class Dashboard extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      expanded1: false,
      expanded2: false,
      expanded3: false
    };
    this.icons = {
      'dots': 'ellipsis-v',
      'open': 'angle-down',
      'close': 'angle-up'
    };
  }


  showUpcoming(firstOrRemaining) {

    let upcomingArray = ((this.props.profile || {}).upcomingArray || {});

    let allUpcomingEvents = [];
    for (i = 0; i < upcomingArray.length; i++) {

      let title = ((((this.props.profile || {}).upcomingArray || {})[i] || {}).title);
      let location = ((((this.props.profile || {}).upcomingArray || {})[i] || {}).location);
      let date = ((((this.props.profile || {}).upcomingArray || {})[i] || {}).date);
      let momentDate = moment(new Date(((date || {}).seconds) * 1000));
      let localDate = moment(momentDate.toISOString()).toString();
      let formattedDate = moment(localDate).format('ddd M/D/YY h:mma');
      let dayNumber = momentDate.toNow(true).split(' ')[0];
      let dayWord = momentDate.toNow(true).split(' ')[1];

      if (title && moment(Date.now()) < momentDate) {

        if (dayNumber === "a" || dayNumber === "an") {
          dayNumber = 1;
        }

        if (dayWord === "days" && dayNumber >= 7) {
          dayNumber = Math.floor(dayNumber / 7);
          dayWord = "weeks";
          if (dayNumber === 1) {
            dayWord = "week";
          }
        }

        allUpcomingEvents.push(
          <View style={styles.dashRow} key={i}>
            <View style={styles.smallerBlock}>
              <Text style={styles.date}> </Text>
            </View>
            <View style={styles.bigBlock}>
              <Text style={styles.subTitle}>{title}</Text>
              <Text style={styles.subText}>{formattedDate}</Text>
              <Text style={styles.subText}>{location}</Text>
              <Text style={styles.subText}></Text>
            </View>
            <View style={styles.smallBlock}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{dayNumber}</Text>
              </View>
              <Text style={styles.days}>{dayWord}</Text>
            </View>
          </View>
        );
      }
    }
    if (firstOrRemaining === 'first') {
      return allUpcomingEvents[0];
    }
    if (firstOrRemaining === 'remaining') {
      return allUpcomingEvents.slice(1);
    }
  }

  showGoals(firstOrRemaining, isComplete) {
    let goalArray = ((this.props.profile || {}).goalArray || {});

    let allGoals = [];
    for (i = 0; i < goalArray.length; i++) {

      let title = ((((this.props.profile || {}).goalArray || {})[i] || {}).title);
      let detail = ((((this.props.profile || {}).goalArray || {})[i] || {}).detail);
      let completed = ((((this.props.profile || {}).goalArray || {})[i] || {}).completed);
      if (completed === isComplete) {

        allGoals.push(
          <View style={styles.dashRow} key={i}>
            <View style={styles.smallerBlock}>
              <Text style={styles.date}> </Text>
            </View>
            <View style={styles.biggerBlock}>
              <Text style={styles.subTitle}>{title}</Text>
              <Text style={styles.subText}>{detail}</Text>
            </View>
          </View>
        );
      }
    }
    if (firstOrRemaining === 'first') {
      if (!allGoals[0]) {
          let message = ["Let's work together on some goals to move you forward.", "Schedule an appointment with your counselor today!"];
        if (isComplete) {
          message = ["Keep up the good work.", "You'll finish a goal soon!"];
        }
        allGoals.push (
          <View style={styles.dashRow} key={i}>
            <View style={styles.smallerBlock}>
              <Text style={styles.date}> </Text>
            </View>
            <View style={styles.biggerBlock}>
              <Text style={styles.subTitle}>{message[0]}</Text>
              <Text style={styles.subText}>{message[1]}</Text>
            </View>
          </View>
        );
      }
      return allGoals[0];
    }
    if (firstOrRemaining === 'remaining') {
      return allGoals.slice(1);
    }

  }

  ellipsisAlert() {
    Alert.alert(
    'Alert Title',
    'My Alert Msg',
    [
      {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
  }

  toggle1() {
    this.setState({
      expanded1: !this.state.expanded1
    });
  }

  toggle2() {
    this.setState({
      expanded2: !this.state.expanded2
    });
  }

  toggle3() {
    this.setState({
      expanded3: !this.state.expanded3
    });
  }

  render() {

    let incentivesEarned = ((this.props.profile || {}).incentivesEarned || 0);
    const incentivesAvailable = 500;
    let percentComplete = (incentivesEarned / incentivesAvailable) * 100;
    let rotation = (1.72 * percentComplete) - 86;

    let dots = this.icons['dots'];
    let icon1 = this.icons['open'];
    if (this.state.expanded1) {
      icon1 = this.icons['close'];
    }
    let icon2 = this.icons['open'];
    if (this.state.expanded2) {
      icon2 = this.icons['close'];
    }
    let icon3 = this.icons['open'];
    if (this.state.expanded3) {
      icon3 = this.icons['close'];
    }
    return (
      <View scrollEnabled={false} style={styles.container}>
        <View style={styles.dashRow}>
          <View><Text style={styles.dots}>&nbsp;</Text></View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, styles.blackText]}>m</Text><Text style={styles.title}>om</Text><Text style={[styles.title, styles.greenText]}>m</Text>
          </View>
          <TouchableHighlight
            onPress={this.ellipsisAlert.bind(this)}
            underlayColor="transparent"
            >
            <Icon
              name={dots}
              style={[styles.title, styles.dots]}
            />
          </TouchableHighlight>
        </View>
        <ScrollView style={styles.main}>
          <View style={styles.padding}>
            <View style={styles.upcomingBox}>
              <Text style={[styles.blockTitle, styles.upcomingTitle]}>COMING UP:</Text>
              {this.showUpcoming('first')}
              {
                this.state.expanded1 && (
                  <View style={styles.dashColumn}>
                    {this.props.children}
                    {this.showUpcoming('remaining')}
                  </View>
                )
              }

              <View style={styles.moreButton}>
                <View style={styles.dashRow}>
                  <Text style={styles.moreButton}></Text>
                  <TouchableHighlight
                    style={styles.dashButton}
                    onPress={this.toggle1.bind(this)}
                    underlayColor="transparent">
                    <Icon
                      style={[styles.FAIcon, styles.icon1]}
                      name={icon1}
                    />
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
          <View style={styles.padding}>
            <View style={styles.progressBox}>
              <View style={styles.spaceRow}>
                <Text style={[styles.bigTitle, styles.bigLetters]}>${incentivesEarned}</Text>
                <Text style={styles.bigBlock}></Text>
                <Text style={styles.bigTitle}>{percentComplete}% Complete!</Text>
              </View>
              <View style={styles.dashRow}>
                <View style={styles.smallerBlock}>
                  <Text style={styles.bigBlock}></Text>
                  <Text style={[styles.money, styles.end]}>$0</Text>
                </View>
                <View style={styles.bottomLine}>

                  <Svg height={100} width={200}>
                    <Svg.Circle
                      cx={100}
                      cy={100}
                      r={85}
                      strokeWidth={6}
                      stroke="#dc552b"
                      fill="#eeeec2"
                    />
                    <Svg.G rotation={rotation} origin="100, 100">
                      <Svg.ClipPath id="clip">
                        <Svg.Rect
                          x={100}
                          height={200}
                          width={200}
                        />
                        <Svg.Polygon
                          points="50,50 120,120" />

                      </Svg.ClipPath>
                      <Svg.Circle
                        cx={100}
                        cy={100}
                        r={85}
                        strokeWidth={6}
                        stroke="#fea488"
                        fill="#fdfffb"
                        clipPath="url(#clip)"
                      />
                      <Svg.Path
                        d="M 100 100 L 100 0"
                        strokeWidth={2}
                        stroke="#020202"
                      />
                      <Svg.Path
                        d="M 100 0 L 95 5"
                        strokeWidth={2}
                        stroke="#020202"
                      />
                      <Svg.Path
                        d="M 100 0 L 105 5"
                        strokeWidth={2}
                        stroke="#020202"
                      />
                    </Svg.G>

                  </Svg>

                </View>
                <View style={styles.smallerBlock}>
                  <Text style={styles.bigBlock}></Text>
                  <Text style={[styles.money, styles.start]}>$500</Text>
                </View>
                <Text style={styles.moreButton}> </Text>
              </View>
            </View>
          </View>

          <View style={styles.padding}>
            <View style={styles.goalsBox}>
              <Text style={[styles.blockTitle, styles.goalsTitle]}>CURRENT GOALS:</Text>

              {this.showGoals('first', false)}

              {
                this.state.expanded2 && (
                  <View style={styles.dashColumn}>
                    {this.props.children}
                    {this.showGoals('remaining', false)}
                  </View>)
              }

              <View style={styles.moreButton}>
                <View style={styles.dashRow}>
                  <Text style={styles.moreButton}></Text>
                  <TouchableHighlight
                    style={styles.dashButton}
                    onPress={this.toggle2.bind(this)}
                    underlayColor="transparent">
                    <Icon
                      style={[styles.FAIcon, styles.icon2]}
                      name={icon2}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.padding}>
            <View style={styles.completedBox}>
              <Text style={[styles.blockTitle, styles.completedTitle]}>COMPLETED:</Text>
              {this.showGoals('first', true)}
              {
                this.state.expanded3 && (
                  <View style={styles.dashColumn}>
                    {this.props.children}
                    {this.showGoals('remaining', true)}
                  </View>)
              }

              <View style={styles.moreButton}>
                <View style={styles.dashRow}>
                  <Text style={styles.moreButton}></Text>
                  <TouchableHighlight
                    style={styles.dashButton}
                    onPress={this.toggle3.bind(this)}
                    underlayColor="transparent">
                    <Icon
                      style={[styles.FAIcon, styles.icon3]}
                      name={icon3}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.padding}>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ session: state.login.session, profile: state.dashboard.profile });

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
