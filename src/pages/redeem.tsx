/* eslint-disable react/no-unescaped-entities */
import { useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import { AnonAadhaarCore, deserialize } from "@anon-aadhaar/core";
import { useEffect, useState } from "react";
import {
  checkIfRedeemed,
  checkVoucherAvailability,
  sendRedeemRequest,
} from "@/utils";
import { Loader } from "@/components/Loader";
import { ShowVoucher } from "@/components/ShowVoucher";

export default function Vote() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const [anonAadhaarCore, setAnonAadhaarCore] = useState<AnonAadhaarCore>();
  const [redeemed, setRedeemed] = useState(null);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [available, setAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckRedeemed = async (nullifier: string) => {
    try {
      const result = await checkIfRedeemed(nullifier);
      setRedeemed(result.redeemed);
      if (result.redeemed) setVoucher(result.voucherCode);
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
      setAnonAadhaarCore(result);
    });
  }, [anonAadhaar, latestProof]);

  const handleRedeem = () => {
    if (anonAadhaarCore) {
      setIsLoading(true);
      sendRedeemRequest(anonAadhaarCore)
        .then((resp) => {
          const { voucherCode } = resp;
          setVoucher(voucherCode);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    }
  };

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
        <div className="max-w-4xl w-full">
          <h2 className="text-[70px] font-rajdhani font-medium leading-none">
            Redeem your voucher
          </h2>
          <div className="text-md mt-4 mb-8 text-[#717686]">
            Now that your identity is verified, you can redeem your voucher.
          </div>

          <div className="flex flex-col gap-5">
            {redeemed ? (
              voucher && (
                <div>
                  <ShowVoucher voucher={voucher} />
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-black sm:grid-cols-2 md:flex lg:gap-x-10 hover:underline">
                    <a
                      key={"Go to Devcon ticket app"}
                      href={"https://tickets.devcon.org/en/tickets/"}
                      target="blank"
                    >
                      {"Get your ticket"} <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              )
            ) : !available ? (
              <>Sorry there is no more vouchers available</>
            ) : isLoading ? (
              <Loader />
            ) : voucher ? (
              <div>
                <ShowVoucher voucher={voucher} />
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                  <a
                    key={"Go to Devcon ticket app"}
                    href={`https://tickets.devcon.org/redeem?voucher=${voucher}`}
                  >
                    {"Go to Devcon ticket app"}{" "}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <button
                  disabled={anonAadhaarCore === undefined}
                  type="button"
                  className="inline-block mt-5 bg-[#009A08] rounded-lg text-white px-14 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
                  onClick={handleRedeem}
                >
                  Redeem
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
