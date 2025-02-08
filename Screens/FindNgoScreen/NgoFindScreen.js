import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Commons/Header';
import { useNavigation } from '@react-navigation/native';

const NGOs = [
    {
        id: 1,
        name: "World Wildlife Fund",
        description: "Conserving nature and protecting the planet.",
        imageUrl: "https://i.ibb.co/sP3jS4d/logo-ptf-unicef.jpg",
    },
    {
        id: 2,
        name: "Doctors Without Borders",
        description: "Providing medical aid where it's needed most.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Doctors_Without_Borders_logo.svg/768px-Doctors_Without_Borders_logo.svg.png",
    },
    {
        id: 3,
        name: "UNICEF",
        description: "Supporting children’s rights and well-being worldwide.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/UNICEF_logo_2018.svg/1024px-UNICEF_logo_2018.svg.png",
    },
    {
        id: 4,
        name: "Amnesty International",
        description: "Fighting for human rights across the globe.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Amnesty_International_Logo.svg/1024px-Amnesty_International_Logo.svg.png",
    }
];

export default function NgoFindScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const handleNgoPress = (ngo) => {
        navigation.navigate('NGODetail', {
            ngoData: ngo // Pass the selected NGO data to the details page
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.cardContainer}>
                    {NGOs.map((ngo) => (
                        <TouchableOpacity 
                            key={ngo.id} 
                            style={styles.ngoCard}
                            onPress={() => handleNgoPress(ngo)} // Navigate on press
                        >
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: ngo.imageUrl }} style={styles.ngoImage} />
                            </View>
                            <View style={styles.ngoContent}>
                                <Text style={styles.ngoName}>{ngo.name}</Text>
                                <Text style={styles.ngoDescription}>{ngo.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <FooterNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },
    ngoCard: {
        width: '48%',
        marginBottom: 20,
        borderRadius: 12,
        elevation: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    ngoImage: {
        width: '100%',
        height: 100,
        borderRadius: 12,
    },
    ngoContent: {
        padding: 12,
    },
    ngoName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    ngoDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        lineHeight: 20,
    },
});
