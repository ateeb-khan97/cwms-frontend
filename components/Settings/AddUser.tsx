'use client';
import {
  Button,
  Checkbox,
  PasswordInput,
  Radio,
  Select,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getCookie } from 'cookies-next';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
//
type FormValues = {
  status: boolean;
  updatePassword: boolean;
  type: 'admin' | 'user';
  user_name: string;
  user_id: string;
  password: string;
  confirm_password: string;
  loc: string;
  phone_number: string;
  email: string;
  rights: string[];
};
//
export default function AddUser({
  isUpdate,
  id,
}: {
  isUpdate: boolean;
  id: string;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [location, setLocation] = useState<any[]>([]);
  const [rightsData, setRightsData] = useState<any[]>([]);
  //
  async function rightsFetcher() {
    const response = await axiosFunction({ urlPath: '/sidebar/find_for_user' });
    setRightsData(response.data);
  }
  async function getLocation() {
    const response = await axiosFunction({ urlPath: '/location/find' });
    setLocation(
      response.data.map((each) => ({
        value: each.loc_code,
        label: each.loc_name,
      })),
    );
  }
  async function findByIdUser() {
    const response = await axiosFunction({
      urlPath: '/user/get-user',
      method: 'POST',
      data: { id },
    });
    if (response.status != 200) {
      router.push('/dashboard/users');
    }
    form.setValues(response.data[0]);
  }
  //
  useEffect(() => {
    setIsAdmin(getCookie('type') == 'admin');
    getLocation();
    rightsFetcher();
    if (isUpdate) findByIdUser();
  }, []);
  const form = useForm<FormValues>({
    initialValues: {
      status: true,
      type: 'user',
      user_name: '',
      user_id: '',
      password: '',
      confirm_password: '',
      loc: '',
      phone_number: '',
      email: '',
      rights: [],
      updatePassword: !isUpdate,
    },
  });
  async function submitHandler(data: FormValues) {
    const method = isUpdate ? 'PUT' : 'POST';
    const response = await axiosFunction({
      urlPath: '/user/',
      method,
      data: {
        ...data,
        id,
      },
    });
    customNotification({
      message: response.message,
      title: response.status == 200 ? 'Success' : 'Failed',
    });
    if (response.status == 200) {
      router.push('/dashboard/users');
    }
  }
  return (
    <>
      <section className="flex items-start">
        <form
          onSubmit={form.onSubmit(submitHandler)}
          className="flex w-1/2 flex-wrap justify-between gap-2 p-5"
          autoComplete="off"
        >
          <Switch
            size="xs"
            className="w-full"
            description="Active / In-Active"
            {...form.getInputProps('status', { type: 'checkbox' })}
            disabled={!isAdmin}
          />
          <Radio.Group
            label="User Type"
            size="xs"
            className="flex flex-col gap-2"
            {...form.getInputProps('type')}
          >
            <Radio disabled={!isAdmin} value={'admin'} label="Admin" />
            <Radio disabled={!isAdmin} value={'user'} label="User" />
          </Radio.Group>
          <TextInput
            disabled={!isAdmin}
            placeholder="Enter full name"
            label="Full Name"
            required
            className="w-full"
            size="xs"
            {...form.getInputProps('user_name')}
          />

          <TextInput
            disabled={!isAdmin}
            placeholder="Enter user id"
            label="User ID"
            required
            className="w-full"
            size="xs"
            autoComplete="false"
            {...form.getInputProps('user_id')}
          />
          <section className="my-2 w-full border-y py-2">
            {isUpdate && (
              <Switch
                size="xs"
                className="w-full"
                label="Update Password"
                description="Yes / No"
                {...form.getInputProps('updatePassword', { type: 'checkbox' })}
              />
            )}
            {form.values.updatePassword && (
              <section className="flex justify-between">
                <PasswordInput
                  placeholder="Enter Password"
                  label="Password"
                  required
                  className="w-[48%]"
                  size="xs"
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  placeholder="Enter Password again"
                  label="Password Check"
                  required
                  className="w-[48%]"
                  size="xs"
                  {...form.getInputProps('confirm_password')}
                />
              </section>
            )}
          </section>
          <Select
            data={location}
            placeholder="Select Location"
            label="Location"
            size="xs"
            className="w-full"
            {...form.getInputProps('loc')}
          />
          <TextInput
            placeholder="Enter phone number"
            label="Phone Number"
            required
            className="w-[48%]"
            size="xs"
            maxLength={11}
            minLength={11}
            disabled={!isAdmin}
            {...form.getInputProps('phone_number')}
          />
          <TextInput
            type="email"
            placeholder="Enter email"
            label="Email"
            required
            className="w-[48%]"
            size="xs"
            disabled={!isAdmin}
            {...form.getInputProps('email')}
          />
          <Button
            type="submit"
            className="ml-auto mt-5 w-56 bg-red-500 hover:bg-red-900"
          >
            {isUpdate ? 'Update' : 'Submit'}
          </Button>
        </form>
        {isAdmin && (
          <div className="w-1/2 p-5 ">
            <h1 className="mb-5 text-xl font-semibold text-[#3b3e66]">
              Page Rights
            </h1>
            <div className="flex flex-col gap-2">
              {rightsData.length > 0 &&
                rightsData.map((eachRight) => {
                  return (
                    <Checkbox.Group
                      className="flex flex-col gap-2"
                      value={form.values.rights}
                      onChange={form.getInputProps('rights').onChange}
                      label={eachRight.label}
                      key={eachRight.id.toString()}
                    >
                      {eachRight.sidebar.map((each_child: any) => {
                        return (
                          <Checkbox
                            key={each_child.id}
                            value={each_child.id.toString()}
                            label={each_child.label}
                          />
                        );
                      })}
                    </Checkbox.Group>
                  );
                })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
