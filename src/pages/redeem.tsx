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
import { useAccount } from "wagmi";
import { AppContext } from "./_app";
import { checkIfRedeemed, checkVoucherAvailability } from "@/utils";

export default function Vote() {
  const [anonAadhaar] = useAnonAadhaar();
  const { setVoted } = useContext(AppContext);
  const [, latestProof] = useProver();
  const [anonAadhaarCore, setAnonAadhaarCore] = useState<AnonAadhaarCore>();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [rating, setRating] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");
  const [redeemed, setRedeemed] = useState(null);
  const [available, setAvailable] = useState(null);

  const handleCheckRedeemed = async () => {
    try {
      const result = await checkIfRedeemed(uniqueIdentifier);
      setRedeemed(result.redeemed);
      if (result.redeemed) {
        alert(`Voucher already redeemed: ${result.voucherCode}`);
      } else {
        alert("Voucher not yet redeemed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckAvailability = async () => {
    try {
      const result = await checkVoucherAvailability();
      setAvailable(result.available);
      alert(
        result.available ? "Vouchers are available" : "No vouchers available"
      );
    } catch (error) {
      alert(error.message);
    }
  };

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

  useEffect(() => {
    if (isSuccess) router.push("./results");
  }, [router, isSuccess]);

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

          <div className="flex flex-col gap-5">
            <div className="text-sm sm:text-lg font-medium font-rajdhani">
              {"On a scale of 0 to 5, how likely are you to recommend this hack?".toUpperCase()}
            </div>
            <Ratings setRating={setRating} />

            <div>
              {isConnected ? (
                isLoading ? (
                  <Loader />
                ) : (
                  <button
                    disabled={
                      rating === undefined || anonAadhaarCore === undefined
                    }
                    type="button"
                    className="inline-block mt-5 bg-[#009A08] rounded-lg text-white px-14 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
                    onClick={() => {}}
                  >
                    VOTE
                  </button>
                )
              ) : (
                <button
                  disabled={true}
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                  You need to connect your wallet first ⬆️
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
