// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Animated, Image} from "react-native";
import {Constants} from "expo";
import {Feather as Icon} from "@expo/vector-icons";

import {Text, APIStore, Avatar, NavigationHelpers, Theme, Post, FirstPost, Images} from "../../components";
import type {ScreenProps} from "../../components/Types";

type ProfileState = {
    scrollAnimation: Animated.Value
};

export default class Profile extends React.Component<ScreenProps<>, ProfileState> {

    componentWillMount() {
        this.setState({
            scrollAnimation: new Animated.Value(0)
        });
    }

    @autobind
    logout() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Welcome");
    }

    render(): React.Node {
        const {navigation} = this.props;
        const uid = APIStore.me();
        const posts = APIStore.posts().filter(post => post.uid === uid);
        const profile = APIStore.profile(uid);
        const {scrollAnimation} = this.state;
        const height = scrollAnimation.interpolate({
            inputRange: [0, 0, 100, 100],
            outputRange: [width, width, statusBarHeight + 100, statusBarHeight + 100]
        });
        const opacity = scrollAnimation.interpolate({
            inputRange: [0, 0, 100, 100],
            outputRange: [1, 1, 0, 0]
        });
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.header, { height } ]}>
                    <AnimatedImage style={[styles.cover, { height }]} source={Images.cover} />
                    <TouchableOpacity onPress={this.logout} style={styles.settings}>
                        <View>
                            <Icon name="log-out" size={25} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Animated.View style={[styles.title, { opacity }]}>
                        <Text type="large" style={styles.outline}>{profile.outline}</Text>
                        <Text type="header2" style={styles.name}>{profile.name}</Text>
                    </Animated.View>
                    <Avatar size={avatarSize} style={styles.avatar} {...profile.picture} />
                </Animated.View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
                    keyExtractor={post => post.id}
                    renderItem={({ item }) => <Post post={item} {...{navigation}} />}
                    ListEmptyComponent={<FirstPost {...{navigation}} />}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y: scrollAnimation
                            }
                        }
                    }])}
                />
            </View>
        );
    }
}

const avatarSize = 100;
const {width} = Dimensions.get("window");
const {statusBarHeight} = Constants;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        flex: 1,
        paddingHorizontal: Theme.spacing.small
    },
    header: {
        marginBottom: avatarSize * 0.5 + Theme.spacing.small
    },
    cover: {
        ...StyleSheet.absoluteFillObject,
        width
    },
    avatar: {
        position: "absolute",
        right: Theme.spacing.small,
        bottom: - avatarSize * 0.5
    },
    settings: {
        position: "absolute",
        top: statusBarHeight + Theme.spacing.small,
        right: Theme.spacing.base,
        backgroundColor: "transparent",
        zIndex: 10000
    },
    title: {
        position: "absolute",
        left: Theme.spacing.small,
        bottom: 50 + Theme.spacing.small
    },
    outline: {
        color: "rgba(255, 255, 255, 0.8)"
    },
    name: {
        color: "white"
    }
});
