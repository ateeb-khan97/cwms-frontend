'use client';
//
import React from 'react';
//
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { Button, Image, PasswordInput, TextInput } from '@mantine/core';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
//
export default function LoginPage() {
  const router = useRouter();
  //
  const userIdRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  //
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    buttonRef.current!.disabled = true;
    //
    const data = {
      user_id: userIdRef.current!.value,
      password: passwordRef.current!.value,
    };
    //
    const response = await axiosFunction({
      urlPath: '/user/login',
      method: 'POST',
      data,
    });
    //
    if (response.status != 200) {
      customNotification({
        title: 'Failed',
        message: response.message,
      });
      buttonRef.current!.disabled = false;
      return;
    }
    //
    customNotification({
      message: 'Login Successfully!',
    });
    //
    setCookie('token', response.data[0].token, { secure: false });
    setCookie('type', response.data[0].type, { secure: false });
    setCookie('user_id', response.data[0].user_id, { secure: false });
    setCookie('acc_no', response.data[0].acc_no, {
      secure: false,
    });
    setCookie('loc_no', response.data[0].loc_no);
    setCookie('user_name', response.data[0].user_name);
    router.push('/dashboard/');
    //
  };
  //
  return (
    <>
      <section className="flex h-screen w-screen items-center justify-center overflow-hidden">
        <main className="flex w-[600px] max-w-[95%] flex-col">
          <header className="flex flex-col items-center">
            <div className="w-72">
              <Image src={'/pharm_logo.png'} />
            </div>
            <h1 className="text-3xl font-bold">Login to your account</h1>
            <p>and let's get those orders moving</p>
          </header>
          <form onSubmit={submitHandler} className="flex flex-col gap-3">
            <TextInput
              ref={userIdRef}
              label="User ID"
              placeholder="Enter your user id"
              required
            />
            <PasswordInput
              ref={passwordRef}
              label="Password"
              placeholder="Enter your password"
              required
            />
            <Button
              ref={buttonRef}
              type={'submit'}
              className="ml-auto w-56 bg-red-600 transition-all hover:scale-110 hover:bg-red-900"
            >
              Sign In
            </Button>
          </form>
        </main>
      </section>
    </>
  );
}
