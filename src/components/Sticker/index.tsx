import { type FC } from 'react';
import { Text, View, type DimensionValue } from 'react-native';
import Screen from '../Screen';
import { Button, type Props as ButtonProps } from '../Button';
import type { SvgProps } from '../UnvalidatedInputs/TonalTextInput';
import { useCurrentThemeColors } from '../../hooks/useColorScheme';
import { defaultPadding } from '../../constants/styling';

export const Sticker = ({
  Sticker,
  title,
  text,
  actionProps,
  StickerProps,
}: {
  Sticker?: FC<SvgProps>;
  StickerProps?: SvgProps;
  title: string;
  text: string;
  actionProps?: ButtonProps;
}) => {
  const theme = useCurrentThemeColors();
  return (
    <Screen id={title}>
      <View
        style={{
          height: '100%',
          width: '100%',
          padding: defaultPadding,
          gap: 12,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Sticker && (
          <Sticker
            color={theme.primary}
            width={'90%'}
            height={'50%'}
            {...StickerProps}
          ></Sticker>
        )}
        <View style={{}}>
          <Text
            style={{
              fontSize: 22,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            {text}
          </Text>
        </View>
        {actionProps && (
          <>
            <Button
              {...actionProps}
              label={actionProps.label}
              onPress={actionProps.onPress}
              type={actionProps.type}
            ></Button>
          </>
        )}
      </View>
    </Screen>
  );
};

export const RowSticker = ({
  Sticker,
  title,
  text,
  actionProps,
  StickerProps,
  ...props
}: {
  Sticker: FC<SvgProps>;
  StickerProps?: SvgProps;
  title: string;
  text: string;
  stickerSize?: DimensionValue;
  actionProps?: ButtonProps;
}) => {
  const theme = useCurrentThemeColors();
  return (
    <>
      <View
        style={{
          width: '100%',
          padding: defaultPadding,
          gap: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <Sticker
          {...StickerProps}
          color={theme.primary}
          width={(props.stickerSize as any) || 60}
          height={(props.stickerSize as any) || 60}
        ></Sticker>
        <View
          style={{
            justifyContent: 'center',
            maxWidth: actionProps ? '60%' : 'auto',
          }}
        >
          <Text
            style={{
              fontSize: 22,
            }}
          >
            {title}
          </Text>
          <Text style={{}}>{text}</Text>
        </View>
        {actionProps && (
          <>
            <Button
              {...actionProps}
              label={actionProps.label}
              onPress={actionProps.onPress}
              type={actionProps.type}
            ></Button>
          </>
        )}
      </View>
    </>
  );
};
