import { MessageOptions, MessageType, showMessage } from 'react-native-flash-message';

interface ToastProps extends MessageOptions {
  message: string;
  backgroundColor?: string;
  color?: string;
  type?: MessageType;
}

export function toast(props: ToastProps) {
  const { message, backgroundColor, color, type = 'info', ...otherProps } = props;

  showMessage({
    message,
    type,
    backgroundColor,
    color,
    ...otherProps,
  });
}
