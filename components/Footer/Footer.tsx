"use client";

import React from "react";

type FooterProps = {};

export const Footer = React.memo(function Footer({}: FooterProps) {
  return (
    <>
      <footer className="bg-primary text-primary-foreground p-6 sm:p-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-lg font-bold text-primary-foreground">About Us</h2>
            <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground">Customer Service</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground">Information</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground">Follow Us</h2>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-primary-foreground">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.46 6c-.77.35-1.59.59-2.46.7.89-.53 1.58-1.36 1.9-2.36-.83.49-1.75.84-2.73 1.03-.79-.83-1.92-1.35-3.16-1.35-2.39 0-4.32 1.93-4.32 4.31 0 .34.04.68.11 1-3.59-.18-6.77-1.89-8.89-4.48-.37.64-.59 1.38-.59 2.17 0 1.5.76 2.83 1.92 3.61-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.49 3.85 3.46 4.25-.36.1-.73.15-1.11.15-.27 0-.54-.02-.8-.07.54 1.68 2.11 2.91 3.97 2.94-1.45 1.14-3.28 1.82-5.28 1.82-.34 0-.67-.02-1-.06 1.88 1.21 4.1 1.92 6.5 1.92 7.79 0 12.05-6.45 12.05-12.04 0-.18 0-.37-.01-.55.83-.6 1.54-1.34 2.1-2.19z"></path>
                </svg>
              </a>
              <a href="#" className="text-primary-foreground">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 2H4.41A2.41 2.41 0 002 4.41v15.17A2.41 2.41 0 004.41 22h15.18A2.41 2.41 0 0022 19.59V4.41A2.41 2.41 0 0019.59 2zm-7.38 16h-2.34v-7h2.34v7zm-1.17-8.02a1.33 1.33 0 11.01-2.66 1.33 1.33 0 01-.01 2.66zm8.53 8.02h-2.34v-3.4c0-.8-.01-1.83-1.11-1.83-1.11 0-1.28.87-1.28 1.77v3.46h-2.34v-7h2.24v.96h.03c.31-.59 1.07-1.2 2.2-1.2 2.36 0 2.8 1.55 2.8 3.57v3.67z"></path>
                </svg>
              </a>
              <a href="#" className="text-primary-foreground">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.04c-5.52 0-9.96 4.44-9.96 9.96 0 4.42 2.89 8.16 6.86 9.49.5.09.68-.22.68-.49v-1.77c-2.78.61-3.36-1.19-3.36-1.19-.46-1.18-1.11-1.49-1.11-1.49-.91-.62.07-.61.07-.61 1 .07 1.53 1.02 1.53 1.02.9 1.53 2.36 1.09 2.94.83.09-.65.36-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02a9.6 9.6 0 012.5-.34c.85 0 1.71.11 2.5.34 1.91-1.3 2.75-1.02 2.75-1.02.55 1.39.2 2.42.1 2.67.64.7 1.03 1.6 1.03 2.69 0 3.84-2.35 4.68-4.58 4.93.37.31.69.91.69 1.83v2.71c0 .27.18.58.69.49a10 10 0 006.84-9.48c0-5.52-4.44-9.96-9.96-9.96z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground pt-4 text-center text-sm text-primary-foreground">
          © 2024 Muhammad Zeeshan Younas. All rights reserved.
        </div>
      </footer>
    </>
  );
});
