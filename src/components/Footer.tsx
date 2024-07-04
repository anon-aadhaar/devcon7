/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, FunctionComponent, SetStateAction, useMemo } from "react";
import imgGithub from "../../public/github-mark.png";
import Image from "next/image";
import { icons } from "../styles/illustrations";
import { Toaster } from "./Toaster";

type FooterProps = {
  isDisplayed: boolean;
  setIsDisplayed: Dispatch<SetStateAction<boolean>>;
};

export const Footer: FunctionComponent<FooterProps> = ({
  isDisplayed,
  setIsDisplayed,
}) => {
  const blob = new Blob([icons.externalLink], { type: "image/svg+xml" });
  const externalLinkIcon = useMemo(
    () => URL.createObjectURL(blob),
    [icons.externalLink]
  );

  return (
    <div className="relative">
      <Toaster isDisplayed={isDisplayed} setIsDisplayed={setIsDisplayed} />
      <footer className="h-24 shadow-[0px_-5px_14px_0px_rgba(48,49,51,0.05)]">
        <div className="w-full mx-auto max-w-screen-xl h-full p-4 flex items-center justify-between">
          <a
            target={"_blank"}
            rel={"noreferrer"}
            href="https://documentation.anon-aadhaar.pse.dev/docs/how-does-it-work"
          >
            <div className="flex flex-row text-sm items-center text-black font-rajdhani font-medium gap-1 hover:underline">
              <p className="leading-none text-lg pt-1">WHAT IS ANON AADHAAR?</p>
              <Image
                priority
                src={externalLinkIcon}
                width={20}
                height={20}
                alt="Check our tutorial"
                className="leading-none"
              />
            </div>
          </a>
          <div className="flex flex-row justify-center items-center gap-8">
            <a
              target={"_blank"}
              rel={"noreferrer"}
              href="https://github.com/anon-aadhaar/devcon7"
            >
              <Image
                alt="github"
                src={imgGithub}
                width={25}
                height={25}
              ></Image>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
