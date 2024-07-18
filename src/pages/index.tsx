/* eslint-disable react/no-unescaped-entities */
import { LaunchProveModal, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import devconImg from "../../public/devcon.png";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const router = useRouter();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      router.push("./redeem");
    }
  }, [anonAadhaar, router]);

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
        <div className="max-w-4xl w-full">
          <Image
            priority
            src={devconImg}
            width={150}
            height={150}
            alt="Check our tutorial"
            className="leading-none mb-10"
          />
          <h6 className="text-[36px] font-rajdhani font-medium leading-none">
            ANON AADHAAR
          </h6>
          <h2 className="text-[70px] font-rajdhani font-medium leading-none">
            DEVCON 7 - Ticket Discounts
          </h2>
          <div className="flex flex-col text-md mt-4 mb-8 gap-4 text-[#717686]">
            <div className="flex">
              <p>
                Prove you’re eligible for a Local SEA Builder Discount on a
                Devcon ticket with Anon Aadhaar!
              </p>
            </div>
            <div className="flex">
              <p>
                Simply prove you’re from India using privacy-preserving ZK
                proofs, and your Aadhaar secure QR code.
              </p>
            </div>
            <div className="flex">
              <p>
                You must generate a fresh <b>Aadhaar secure QR code</b>, and can
                only verify a QR code that was{" "}
                <b>generated within 24 hours</b>.
              </p>
            </div>
            <div className="flex">
              <p>
                <b>Please press continue below to get started</b>.
              </p>
            </div>
          </div>

          <div className="flex w-full gap-8 mb-8">
            <div>
              <div className="flex gap-4 place-content-center">
                <LaunchProveModal
                  nullifierSeed={Number(process.env.NEXT_PUBLIC_NULLIFIER_SEED)}
                  buttonStyle={{
                    borderRadius: "8px",
                    border: "solid",
                    borderWidth: "1px",
                    boxShadow: "none",
                    fontWeight: 500,
                    borderColor: "#009A08",
                    color: "#009A08",
                    fontFamily: "rajdhani",
                  }}
                  buttonTitle={"Continue Applying for Discount"}
                />
              </div>
            </div>
          </div>
          <div>
            Btw — this collab between AnonAadhaar & Devcon started with a{" "}
            <a
              href="https://forum.devcon.org/t/dip-40-integration-of-anon-aadhaar-for-ticket-discounts-targeting-indian-citizens/3632"
              target="blank"
              className="text-blue-500"
            >
              DIP
            </a>{" "}
          </div>
        </div>
      </main>
    </>
  );
}
