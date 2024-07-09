/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

type ErrorProps = {
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  errorMessage: any;
};

export const Error: FunctionComponent<ErrorProps> = ({
  setErrorMessage,
  errorMessage,
}) => {
  return (
    errorMessage && (
      <div className="rounded-md bg-red-50 p-4 mt-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <button onClick={() => setErrorMessage(null)}>
              <XCircleIcon
                aria-hidden="true"
                className="h-5 w-5 text-red-400"
              />
            </button>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
          </div>
        </div>
      </div>
    )
  );
};
