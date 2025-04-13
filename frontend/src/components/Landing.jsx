import { Link } from "react-router-dom";
import { Button } from "./ui/button";

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
            Transform your words into elegant handwriting and handwritten notes
            into editable, searchable text — all in one powerful platform.
            Scriptify AI blends the art of penmanship with the precision of AI,
            featuring a rich, intuitive text editor that lets you write,
            convert, and customize effortlessly. Whether you're digitizing notes
            or adding a personal touch to your messages, Scriptify AI makes your
            script smart.
          </p>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <Link to="handwritingtotext"><Button>Handwriting to Text</Button></Link>
          <Link to="texttohandwriting"><Button>Text to Handwriting</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
