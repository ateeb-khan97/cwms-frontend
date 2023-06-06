'use client';
//
import { notifications, showNotification } from '@mantine/notifications';
import { MdCheck, MdClose } from 'react-icons/md';
// types
type TitleType = 'Success' | 'Failed';
type NotificationType = {
  title?: TitleType;
  message: string;
};
//
export default function customNotification({
  message,
  title = 'Success',
}: NotificationType) {
  //
  const isSuccess: boolean = title == 'Success';
  //
  return notifications.show({
    message: message,
    title: title,
    autoClose: 3000,
    color: isSuccess ? 'green' : 'red',
    icon: isSuccess ? <MdCheck /> : <MdClose />,
  });
}
