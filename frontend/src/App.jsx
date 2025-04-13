import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LandingBg from "/LandingBg.jpg";
import { waveform } from "ldrs";
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import HandwritingToText from "./components/HandwritingToText";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TextToHandwriting from "./components/TextToHandwriting";


const App = () => {
  const [loading, setLoading] = useState(true);
  const [animateLoading, setAnimateLoading] = useState(false);

  useEffect(() => {
    waveform.register();
  }, []);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      setLoading(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setAnimateLoading(true);

      const timer2 = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasVisited", "true");
        document.body.classList.remove("loader");
      }, 4200);

      return () => clearTimeout(timer2);
    }, 5500);

    return () => clearTimeout(timer1);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/handwritingtotext" element={<HandwritingToText/>}/>
        <Route path="/texttohandwriting" element={<TextToHandwriting />}/>
        <Route path="/" element={<Wrapper />}/>
      </Routes>
      {loading && (
      <div className="loader overflow-hidden z-[100] absolute">
        <motion.div
          initial={{ y: 0 }}
          animate={
            animateLoading
              ? { y: "-100vh", display: "none", visibility: "hidden" }
              : {}
          }
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center bg-white z-50 w-full h-full overflow-hidden"
        >
          <div className="grid place-items-center relative">
            <div className="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-12 w-12 absolute scale-125"
                fill="#e2e8f0"
              >
                <path d="M30 7v18a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h9V0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7z" />
                <path d="M22.38 24H11a3 3 0 0 1 0-6h4v-2h-4a5 5 0 0 0 0 10h13a1 1 0 0 0 .89-.55l2-4A1 1 0 0 0 27 21V1a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v20a1 1 0 0 0 .11.45zM23 2h2v1h-2zm0 3h2v15h-2z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-12 w-12 absolute scale-125"
                fill="#000"
                style={{
                  mask: "url(#fill-mask)",
                  WebkitMask: "url(#fill-mask)",
                }}
              >
                <defs>
                  <mask id="fill-mask">
                    <motion.rect
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 4,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                      width="52"
                      height="52"
                      fill="white"
                    />
                  </mask>
                </defs>
                <path d="M30 7v18a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h9V0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7z" />
                <path d="M22.38 24H11a3 3 0 0 1 0-6h4v-2h-4a5 5 0 0 0 0 10h13a1 1 0 0 0 .89-.55l2-4A1 1 0 0 0 27 21V1a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v20a1 1 0 0 0 .11.45zM23 2h2v1h-2zm0 3h2v15h-2z" />
              </svg>
            </div>

            <div className="relative mt-11">
              <l-waveform
                size="25"
                stroke="2"
                speed="1"
                color="black"
              ></l-waveform>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </>
  );
};

const Wrapper = () => (
  <div className="h-screen bg-gray-100">
        <div
          style={{
            backgroundImage: `url(${LandingBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-screen overflow-hidden"
        >
          <div className="pt-4">
            <Nav />
          </div>
          <Landing />
        </div>
      </div>
)

export default App;
