'use client';
import React from 'react';
import Sleep1 from "./Sleep1/page";
import PageSimple from './route1';
import { BrowserRouter } from "react-router-dom";
export default function Home() {
  return (
    <>
    <BrowserRouter>
      <Sleep1></Sleep1>
      <PageSimple />
</BrowserRouter>
    </>
  )
}