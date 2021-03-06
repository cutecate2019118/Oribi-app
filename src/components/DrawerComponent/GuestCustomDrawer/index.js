import * as React from 'react';
import { 
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    Dimensions
 } from 'react-native';
 import Modal, { ModalContent, SlideAnimation } from 'react-native-modals';
 import Animated from 'react-native-reanimated';
import { DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import styles from '../styles';

import Colors from '../../../constants/Colors';
import Lang from '../../../constants/language';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import userImage from '../../../assets/images/placeholder.jpg';
import LogOutIcon from '../../../assets/images/logout.png';
import HelpIcon from '../../../assets/images/help.png';

const{ width, height } = Dimensions.get('window');

export default function CustomDrawerContent(props) {
    const { progress, ...rest } = props;
    const { getLangResponse, getLang, fbSignOut } = props.childProps;
    const { language, isLoading } = getLangResponse;
    // const [name, setName] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    let name = '';
    React.useEffect(() => {
        let unmounted = false;
        const updateName = async () => {
            let fName = await AsyncStorage.getItem('FirstName');
            let lName = await AsyncStorage.getItem('LastName');
            name = fName + " " + lName;
            // setName(fName + " " + lName);
        }
        updateName();
        return () => { unmounted = true };
    },[])

    const translateX = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [-100, 0],
    });

    async function langSelect(lang) {
        try {
            await ('Language', lang);
            getLang(lang);
        } catch(e) {
            console.log(e);
        }
    }

    async function logOut() {
        props.navigation.closeDrawer();
        setTimeout(async function() {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('mail');
            await AsyncStorage.removeItem('fName');
            await AsyncStorage.removeItem('lName');
            await AsyncStorage.removeItem('fNameEng');
            await AsyncStorage.removeItem('lNameEng');
            await AsyncStorage.removeItem('phone');
            await AsyncStorage.removeItem('FirstName');
            await AsyncStorage.removeItem('LastName');
            fbSignOut();
        }, 500)
    }

    const gotoChat = () => {
        setModalVisible(false);
        props.navigation.closeDrawer();
        const { navigate } = props.navigation;
        setTimeout(function() {
            navigate('chat');
        }, 500)
    }

    const gotoFAQ = () => {
        setModalVisible(false);
        props.navigation.closeDrawer();
        const { navigate } = props.navigation;
        setTimeout(function() {
            navigate('faq');
        }, 500)
    }
  
    if(isLoading) {
        return null;
    } else {
        let lang = parseInt(language);
        return (
            <ScrollView contentContainerStyle={ styles.contentContainer }>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never', backgroundColor: '#2f2e2e' }}>
                    <View style={ styles.imageContainer }>
                        <Image source={ userImage } style={ styles.image } />
                        <Text style={ styles.nameText }>{name}</Text>
                        <TouchableOpacity style={styles.closeIconContainer} onPress={() => props.navigation.closeDrawer()}>
                            <FontAwesomeIcon name="close" size={32} color={'#959090'} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ backgroundColor: '#2f2e2e', height: height - 175 - 136 }} >
                        <Animated.View style={{ transform: [{ translateX }] }}>
                            <DrawerItemList {...rest} />
                        </Animated.View>
                        <Animated.View style={[{ transform: [{ translateX }] }]}>
                            <DrawerItem
                                label={Lang.menu[lang].logout}
                                activeTintColor={"#ffffff"}
                                activeBackgroundColor={'#403f3f'}
                                inactiveTintColor={'#ffffff'}
                                onPress={() => logOut()}
                                icon={({ focused, color, size }) => <Image source={LogOutIcon} style={{ width: 22, height: 24, tintColor: Colors.iconColor }} />}/>
                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>
                <SafeAreaView style={{backgroundColor: '#212020'}}>
                    <View style={{ backgroundColor: '#2f2e2e' }}>
                        <TouchableOpacity style={styles.extraMenuContainer} onPress={() => setModalVisible(true)}>
                            <Image source={HelpIcon} style={{ width: 30, height: 30, tintColor: Colors.color2 }} />
                            <Text style={styles.extraMenuText}>{Lang.menu[lang].help}</Text>
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={ [styles.languageContainer, { transform: [{ translateX }] }] }>
                        <TouchableOpacity style={ styles.langTextContainer } onPress={() => langSelect('0')}>
                            <Text style={styles.langText}>EN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.langTextContainer } onPress={() => langSelect('1')}>
                            <Text style={styles.langText}>RU</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.langTextContainer } onPress={() => langSelect('2')}>
                            <Text style={styles.langText}>KA</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </SafeAreaView>
                <Modal
                    onTouchOutside={() => setModalVisible(false)}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    swipeDirection={['up', 'down']}
                    swipeThreshold={200}
                    visible={modalVisible}>
                    <ModalContent>
                        <TouchableOpacity style={styles.modalButtonStyle} onPress={gotoChat}>
                            <Text style={styles.modalButtonText}>{Lang.menu[lang].chat}</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.modalButtonStyle} onPress={gotoFAQ}>
                            <Text style={styles.modalButtonText}>{Lang.menu[lang].faq}</Text>
                        </TouchableOpacity>
                    </ModalContent>
                </Modal>
            </ScrollView>
        );
    }
}