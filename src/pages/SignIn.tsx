import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useCallback, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DismissKeyboardView from '../components/DismissKeyboardView.tsx';
import {RootStackParamList} from '../../AppInner.tsx';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text: string) => setEmail(text), []);
  const onChangePassword = useCallback((text: string) => setPassword(text), []);

  const canGoNext = email && password;

  // 로그인 submit 함수
  const submitSignIn = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    Alert.alert('알림', 'Hello World!');
  }, [email, password]);

  // 회원가입 submit 함수
  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, []);

  return (
    <DismissKeyboardView>
      {/*이메일*/}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          ref={emailRef}
          placeholder="이메일을 입력해주세요."
          value={email}
          style={styles.textInput}
          onChangeText={onChangeEmail}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false} // input의 포커스가 변경될 때 자판기 ui가 중복 작동하며 내려가지 않도록 설정
          clearButtonMode="while-editing" // iphone에서 input 모두 지우는 아이콘 활성
          keyboardType="email-address" // 기본적으로 @ 이 붙은 키보드 ui를 보여줌
        />
      </View>

      {/*비밀번호*/}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          ref={passwordRef}
          placeholder="비밀번호를 입력해주세요."
          value={password}
          style={styles.textInput}
          onChangeText={onChangePassword}
          onSubmitEditing={submitSignIn}
          secureTextEntry // 글자 별표(*) 처리
          importantForAutofill="yes" // 자동 입력 여부
          autoComplete="password" // 비밀번호 자동 완성 기능
          textContentType="password" // text 타입
          clearButtonMode="while-editing" // iphone에서 input 모두 지우는 아이콘 활성
          // keyboardType="decimal-pad" // 숫자 키보드로 변환
        />
      </View>

      {/*로그인, 회원가입 버튼*/}
      <View style={styles.buttons}>
        <Pressable
          onPress={submitSignIn}
          style={
            !canGoNext
              ? styles.signInButton
              : StyleSheet.compose(
                  styles.signInButton,
                  styles.signInButtonActive,
                ) // Styles.compose()를 사용하여도 배열에 담는 것과 같은 역할을 해줌(스타일 적용 우선 순위 지정)
          }
          disabled={!canGoNext}>
          <Text style={styles.signInButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  signInButtonActive: {
    backgroundColor: 'blue',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignIn;
