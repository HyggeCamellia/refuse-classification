'use client';
import React from 'react';
import Sleep1 from "./Sleep1/page";

import { BrowserRouter } from "react-router-dom";
import LoginForm from './disembark/components/LoginForm';
export default function Home() {
  return (
    <>
      <BrowserRouter>
        <LoginForm />
     
      </BrowserRouter>

    </>
  )
}