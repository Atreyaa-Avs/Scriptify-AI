import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Pic from "/ButtonPic.png";
import { CornerDownRight, CornerUpRight, MoveRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex mx-auto max-w-screen-xl">
      <div className="text-center text-black p-10 flex flex-col gap-5">
        <h1 className="text-black text-6xl text-balance pointer-events-none tracking-tighter leading-none">
          Text & Handwriting meets Intelligence - Seamless, Smart and
          Effortless.
        </h1>
        <div className=" text-black pointer-events-none text-md max-w-screen-lg mx-auto font-medium">
          <p>
            Scriptify AI is a powerful platform that transforms handwritten
            images into clean, editable, and searchable text with exceptional
            accuracy. Beyond digitization, it features an intelligent text
            editor equipped with built-in tools for summarization and
            translation, allowing users to refine, condense, and convert content
            into multiple languages effortlessly.
          </p>
        </div>
        <div className="flex flex-col gap-5 items-center justify-center">
          <img src={Pic} alt="" className="w-56 h-36" />
          <Link to="handwritingtotext">
            <Button>
              Go to Editor
              <MoveRight className="mt-[2px] scale-110" />
            </Button>
          </Link>
          {/* <Link to="texttohandwriting"><Button>Text to Handwriting</Button></Link> */}
        </div>
      </div>
    </div>
  );
};

export default Landing;
