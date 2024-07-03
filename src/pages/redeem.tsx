/* eslint-disable react/no-unescaped-entities */
import { useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import {
  AnonAadhaarCore,
  deserialize,
  packGroth16Proof,
} from "@anon-aadhaar/core";
import { useEffect, useState, useContext } from "react";
import { Ratings } from "@/components/Ratings";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import { AppContext } from "./_app";
import { checkIfRedeemed, checkVoucherAvailability } from "@/utils";

export default function Vote() {
  const [anonAadhaar] = useAnonAadhaar();
  const { setVoted } = useContext(AppContext);
  const [, latestProof] = useProver();
  const [anonAadhaarCore, setAnonAadhaarCore] = useState<AnonAadhaarCore>();
  const router = useRouter();
  const [rating, setRating] = useState<string>();
  const [redeemed, setRedeemed] = useState(null);
  const [available, setAvailable] = useState(null);

  const handleCheckRedeemed = async (nullifier: string) => {
    try {
      const result = await checkIfRedeemed(nullifier);
      setRedeemed(result.redeemed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckAvailability = async () => {
    try {
      const result = await checkVoucherAvailability();
      setAvailable(result.available);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (anonAadhaarCore) handleCheckRedeemed(anonAadhaarCore.proof.nullifier);
    handleCheckAvailability();
  }, [anonAadhaarCore]);

  useEffect(() => {
    // To do: fix the hook in the react lib
    const aaObj = localStorage.getItem("anonAadhaar");
    const anonAadhaarProofs = JSON.parse(aaObj!).anonAadhaarProofs;

    deserialize(
      anonAadhaarProofs[Object.keys(anonAadhaarProofs).length - 1].pcd
    ).then((result) => {
      console.log(result);
      setAnonAadhaarCore(result);
    });
  }, [anonAadhaar, latestProof]);

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
        <div className="max-w-4xl w-full">
          <h2 className="text-[90px] font-rajdhani font-medium leading-none">
            CAST YOUR VOTE
          </h2>
          <div className="text-md mt-4 mb-8 text-[#717686]">
            Next, you have the option to cast your vote alongside your Anon
            Adhaar proof, using your connected ETH address. Your vote will be
            paired with your proof, and the smart contract will initially verify
            your proof before processing your vote.
          </div>

          {redeemed ? (
            <>You've already redeemed your voucher</>
          ) : !available ? (
            <>Sorry there is no more vouchers available</>
          ) : (
            <>REDEEM BUTTON</>
          )}

          <div className="flex flex-col gap-5">
            <div>
              <button
                disabled={rating === undefined || anonAadhaarCore === undefined}
                type="button"
                className="inline-block mt-5 bg-[#009A08] rounded-lg text-white px-14 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
                onClick={() => {}}
              >
                VOTE
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
