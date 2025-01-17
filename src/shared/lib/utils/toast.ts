import { MessageOptions, showMessage } from 'react-native-flash-message';

interface ToastProps extends MessageOptions {
  message: string;
  backgroundColor?: string;
  color?: string;
}

export function toast(props: ToastProps) {
  const { message, backgroundColor, color, ...otherProps } = props;

  showMessage({
    message,
    type: 'info',
    backgroundColor,
    color,
    ...otherProps,
  });
}
