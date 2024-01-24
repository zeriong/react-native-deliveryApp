import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App.tsx';
import Ing from './Ing.tsx';
import Complete from './Complete.tsx';

const Stack = createNativeStackNavigator();

function Delivery() {
  return (
    // Stack Navigator를 사용하여 지도 screen을 띄운 상태에서 완료 창을 띄우기 위한 방식
    <Stack.Navigator initialRouteName="Ing">
      <Stack.Screen name="Ing" component={Ing} options={{headerShown: false}} />
      <Stack.Screen
        name="Copmplete"
        component={Complete}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Delivery;
