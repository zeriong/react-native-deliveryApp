// 공유 레퍼런스를 통해 직접 라이브러리에 타입 지정
// 해당 d.ts 파일을 통해 라이브러리에 타입 지정안되어 발생하던 에러를 해결할 수 있게 되었다.

declare module 'react-native-keyboard-aware-scrollview' {
  import * as React from 'react';
  import {Constructor, ViewProps} from 'react-native';
  class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent &
    Constructor<any>;
  class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export {KeyboardAwareScrollView};
}
