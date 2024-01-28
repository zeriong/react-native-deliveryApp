import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import orderSlice from '../slices/order';
import {useAppDispatch} from '../store';

function Complete() {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<LoggedInParamList>>();
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const onResponse = useCallback(async (response: any) => {
    console.log(response.width, response.height, response.exif);
    // 미리보기 이미지를 위한 setState. 이미지의 uri(경로)와 base64로 변환된 이미지를 삽입하고 아래 native Image 태그에 source에 넣어주면 된다.
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    // 이미지 용량을 줄임 프론트에서 이미지를 리사이징해서 보내주어야 서버에 부하가 적어짐.
    // 이미지는 대체로 용량이 많기 때문에 실제로 프론트에서 리사이징해주지 않는다면 서버가 터질 우려도 있음
    return ImageResizer.createResizedImage(
      response.path, // 파일 경로 (response.data랑은 다름!) / 파일의 경로 ex) file:///안드로이드 경로
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100, // 줄일수록 용량이 줄고 사진 퀄리티도 낮아짐
      0, // 혹시나 이미지가 뒤집어지는 현상이 생길 경우 orientation변수를 활용하여 추가 코딩
    ).then(r => {
      console.log(r.uri, r.name);

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      includeBase64: true, // 미리보기 표시를 위한 옵션
      includeExif: true, // 촬영된 사진의 정방향이 어디인지 체크 후 인코딩해주는 옵션 (세로, 가로, 뒤집어 찍기 등에 대한 대응)
      saveToPhotos: true, // 촬영 즉시 사진 저장 (WRITE_EXTERNAL_STORAGE 권한 필요)
      // cropping: true, // 촬영 후 업로드할 때 즉시 이미지 편집기로 이동
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  // route는 params를 전달받을 수 있다.
  // (Ing.tsx의 125_line에서 전달해준 orderId가 params에 담긴 것)
  const orderId = route.params?.orderId;
  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }
    // 이미지는 폼데이터에 넣어서 보내준다.
    const formData = new FormData();
    formData.append('image', image);
    formData.append('orderId', orderId);
    try {
      await axios.post(`${Config.API_URL}/complete`, formData, {
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('알림', '완료처리 되었습니다.');
      // 오더완료 후 이전화면으로 돌아가기를 할 때 다시 Delivery로 돌아가는 현상을 막기 위해 뒤로 다시 돌아갔다가 navigate를 통해 Settings로 이동
      navigation.goBack();
      navigation.navigate('Settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [dispatch, navigation, image, orderId, accessToken]);

  return (
    <View>
      <View style={styles.orderId}>
        <Text style={{color: 'black'}}>주문번호: {orderId}</Text>
      </View>
      <View style={styles.preview}>
        {preview && <Image style={styles.previewImage} source={preview} />}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onChangeFile}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        <Pressable
          style={
            image
              ? styles.button
              : StyleSheet.compose(styles.button, styles.buttonDisabled)
          }
          onPress={onComplete}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
  },
  buttonWrapper: {flexDirection: 'row', justifyContent: 'center'},
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});

export default Complete;
