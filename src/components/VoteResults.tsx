import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Loader } from "./Loader";

export const VoteResults: FunctionComponent = () => {
  const [totalVote, setTotalVote] = useState(0);
  const [ready, setReady] = useState(false);

  return (
    <>
      {ready ? (
        <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
          {totalVote} voters 🇮🇳
        </span>
      ) : (
        <Loader />
      )}
    </>
  );
};
