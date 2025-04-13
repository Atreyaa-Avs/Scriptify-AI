import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="mx-auto max-w-screen-lg relative rounded-lg max-xl:px-10">
      <div className="bg-neutral-200 flex justify-between items-center max-w-screen-lg mx-auto py-3 px-4 rounded-md shadow-2xl">
        <div className="font-bold text-lg flex gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="h-6 md:h-8 "
          >
            <g data-name="75-Write">
              <path d="M30 7v18a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h9V0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7z"></path>
              <path d="M22.38 24H11a3 3 0 0 1 0-6h4v-2h-4a5 5 0 0 0 0 10h13a1 1 0 0 0 .89-.55l2-4A1 1 0 0 0 27 21V1a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v20a1 1 0 0 0 .11.45zM23 2h2v1h-2zm0 3h2v15h-2z"></path>
            </g>
          </svg>
          <Link to="/">Scriptify AI</Link>
        </div>
        <div className="flex gap-6 font-semibold text-base">
          <Link
            to="/handwritingtotext"
            className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full bg-black py-2 px-4 text-white rounded-md hover:bg-neutral-800"
          >
            Handwriting to Text
          </Link>

          <Link
            to="/texttohandwriting"
            className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full bg-white py-2 px-4 text-black rounded-md hover:bg-neutral-100"
          >
            Text to Handwriting
          </Link>
        </div>
      </div>
      <div className="mt-5 -mb-6 text-center bg-pink-500 w-fit mx-auto py-1 px-6 rounded-lg text-neutral-100 flex items-center justify-center font-semibold">
        <p className=""> Write Beyond Limits </p>
      </div>
    </nav>
  );
};

export default Nav;
