import {
    StyleSheet, 
    Dimensions,
    PixelRatio,
} from 'react-native';

const getWindowDimensions = () => Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = getWindowDimensions();
const scale = SCREEN_WIDTH > 0 ? SCREEN_WIDTH / 375 : 1;

const normalize = (size) => {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: normalize(16),
        paddingBottom: normalize(32),
    },
    errorContainer: {
        backgroundColor: '#FFE5E5',
        padding: normalize(10),
        borderRadius: normalize(8),
        marginBottom: normalize(16),
    },
    errorText: {
        color: '#D32F2F',
        fontSize: normalize(14),
    },
    sectionTitle: {
        fontSize: normalize(24),
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: normalize(8),
    },
    sectionSubtitle: {
        fontSize: normalize(14),
        color: '#666666',
        marginBottom: normalize(16),
    },

    imageCarousel: {
        marginVertical: normalize(16),
    },
    imageCarouselContent: {
        paddingHorizontal: normalize(16),
        gap: normalize(12),
    },
    imageBox: {
        width: normalize(150),
        height: normalize(150),
        borderRadius: normalize(12),
        overflow: 'hidden',
        position: 'relative',
        marginRight: normalize(12),
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: normalize(12),
    },
    removeIconContainer: {
        position: 'absolute',
        top: normalize(8),
        right: normalize(8),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: normalize(12),
        padding: normalize(2),
    },
    addImageBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: normalize(2),
        borderColor: '#ddd',
        backgroundColor: '#F0F0F0',
    },
    uploadText: {
        fontSize: normalize(12),
        color: '#893571',
        marginTop: normalize(4),
        textAlign: 'center',
    },

    inputSection: {
        marginTop: normalize(16),
        gap: normalize(12),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(12),
        height: normalize(56),
        backgroundColor: '#FFFFFF',
    },
    inputContainerActive: {
        borderColor: '#893571',
        borderWidth: 2,
    },
    descriptionContainer: {
        height: normalize(112),
        alignItems: 'flex-start',
        paddingVertical: normalize(8),
    },
    input: {
        flex: 1,
        marginLeft: normalize(8),
        fontSize: normalize(16),
        color: '#333333',
    },
    descriptionInput: {
        height: '100%',
        textAlignVertical: 'top',
    },
    pickerContainer: {
        padding: 0,
        margin: 0,
    },
    picker: {
        flex: 1,
        height: normalize(56),
        marginLeft: normalize(8),
    },
    charCount: {
        fontSize: normalize(12),
        color: '#999',
        marginLeft: normalize(8),
    },
    descriptionCharCount: {
        position: 'absolute',
        bottom: normalize(8),
        right: normalize(10),
        fontSize: normalize(12),
        color: '#999',
    },
    nextButton: {
        backgroundColor: '#893571',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: normalize(16),
        borderRadius: normalize(8),
        marginTop: normalize(24),
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: normalize(16),
        fontWeight: 'bold',
        marginRight: normalize(8),
    },
});

export default styles;
