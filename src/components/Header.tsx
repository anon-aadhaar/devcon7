/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useContext, useMemo } from "react";
import Image from "next/image";
import { icons } from "../styles/illustrations";

export const Header: FunctionComponent = () => {
  const blob = new Blob([icons.aalogo], { type: "image/svg+xml" });
  const aaLogo = useMemo(() => URL.createObjectURL(blob), [icons.aalogo]);

  return (
    <header className="flex flex-row justify-between">
      <div className="flex flex-row items-center mx-5 p-5">
        <Image
          priority
          src={aaLogo}
          width={40}
          height={40}
          alt="Follow us on Twitter"
        />
      </div>
      <div className="flex flex-row gap-3 items-center justify-end">
        <div className="flex m-5 items-center space-x-2"></div>
      </div>
    </header>
  );
};
