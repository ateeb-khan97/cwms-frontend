'use client';
//
import { notifications, showNotification } from '@mantine/notifications';
import { MdCheck, MdClose } from 'react-icons/md';
// types
type TitleType = 'Success' | 'Failed';
type NotificationType = {
  title?: TitleType;
  message: string;
  autoClose?: boolean;
};
//
export default function customNotification({
  message,
  title = 'Success',
  autoClose = true,
}: NotificationType) {
  //
  const isSuccess: boolean = title == 'Success';
  //
  return notifications.show({
    message: message,
    title: title,
    autoClose: autoClose ? 3000 : undefined,
    color: isSuccess ? 'green' : 'red',
    icon: isSuccess ? <MdCheck /> : <MdClose />,
  });
}
