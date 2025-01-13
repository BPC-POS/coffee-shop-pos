import * as React from 'react';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import renderer from 'react-test-renderer';


it(`renders correctly`, () => {
  const tree = renderer.create(<View>Snapshot test!</View>).toJSON();

  expect(tree).toMatchSnapshot();
});
