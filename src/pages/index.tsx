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
          <div className="text-md mt-4 mb-8 text-[#717686]">
            The Devcon team is{" "}
            <a
              href="https://forum.devcon.org/t/dip-40-integration-of-anon-aadhaar-for-ticket-discounts-targeting-indian-citizens/3632"
              target="blank"
              className="text-blue-500"
            >
              working with Anon Aadhaar
            </a>{" "}
            to allow Indian residents to use Zero-Knowledge Proofs (ZKPs) to
            prove Indian residency for a <i>chance at qualifying</i> for a{" "}
            <b>discounted ticket</b> to Devcon.
            <br />
            <br />
            <p>
              Simply prove you're from India using privacy-preserving ZKPs &
              your Aadhaar secure QR code.
            </p>
          </div>
          <div className="text-md mt-4 mb-8 text-[#717686]">
            You must generate a fresh <b>Aadhaar secure QR code</b>, and can
            only verify a QR code that was <b>generated less than 1 hour ago</b>
            , please press continue below to get started.
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
        </div>
      </main>
    </>
  );
}
