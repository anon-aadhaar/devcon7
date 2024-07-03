import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../supabaseAdmin";
import {
  verify,
  init,
  artifactUrls,
  ArtifactsOrigin,
  InitArgs,
  AnonAadhaarCore,
} from "@anon-aadhaar/core";

const formatTimestamp = (unix_timestamp: number) => {
  var date = new Date(unix_timestamp * 1000);

  // Hours part from the timestamp
  var hours = date.getHours();

  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();

  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  console.log(formattedTime);
};

const pubKeyHash =
  "15134874015316324267425466444584014077184337590635665158241104437045239495873";
// const prodPubKeyHash =
//   "18063425702624337643644061197836918910810808173893535653269228433734128853484";

async function verifyAnonAadhaarProof(anonAadhaarProof: AnonAadhaarCore) {
  if (!(await verify(anonAadhaarProof)))
    throw Error("[verifyAnonAadhaarProof]: Your proof is not a valid proof.");
  if (!(pubKeyHash === anonAadhaarProof.proof.pubkeyHash))
    throw Error(
      "[verifyAnonAadhaarProof]: The document was not signed with the Indian government public key."
    );
  formatTimestamp(Math.floor(Date.now() / 1000));
  formatTimestamp(Number(anonAadhaarProof.proof.timestamp));
  console.log(
    "Difference: ",
    Math.floor(Date.now() / 1000) - Number(anonAadhaarProof.proof.timestamp)
  );
  if (
    !(
      Math.floor(Date.now() / 1000) - Number(anonAadhaarProof.proof.timestamp) <
      3600
    )
  )
    throw Error(
      "[verifyAnonAadhaarProof]: Your QR must have been signed less than 1 hour ago."
    );
  if (
    !(
      anonAadhaarProof.proof.nullifierSeed ===
      process.env.NEXT_PUBLIC_NULLIFIER_SEED!
    )
  )
    throw Error(
      "[verifyAnonAadhaarProof]: Your must generate a proof from authorised frontend."
    );

  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { anonAadhaarProof }: { anonAadhaarProof: AnonAadhaarCore } =
      req.body;
    const anonAadhaarInitArgs: InitArgs = {
      wasmURL: artifactUrls.v2.wasm,
      zkeyURL: artifactUrls.v2.zkey,
      vkeyURL: artifactUrls.v2.vk,
      artifactsOrigin: ArtifactsOrigin.server,
    };

    await init(anonAadhaarInitArgs);

    let verified = false;
    try {
      verified = await verifyAnonAadhaarProof(anonAadhaarProof);
    } catch (e) {
      return res.status(409).json({ error: (e as Error).message });
    }

    const nullifier = anonAadhaarProof.proof.nullifier;

    if (!verified)
      return res
        .status(401)
        .json({ error: "Unauthorized, your proof is not valid." });

    // Check if the user has already claimed a voucher
    const { data: existingVoucher, error: existingVoucherError } =
      await supabaseAdmin
        .from("Vouchers")
        .select("voucher_code")
        .eq("nullifier", nullifier)
        .single();

    if (existingVoucher)
      return res.status(409).json({ error: "Voucher already issued" });

    // Fetch an available voucher
    const { data: voucher, error: voucherError } = await supabaseAdmin
      .from("Vouchers")
      .select("id, voucher_code")
      .is("nullifier", null)
      .limit(1)
      .single();

    if (voucherError || !voucher)
      return res.status(404).json({ error: "No vouchers available" });

    // Update the voucher with the user's unique identifier
    const { error: updateError } = await supabaseAdmin
      .from("Vouchers")
      .update({ nullifier: nullifier })
      .eq("id", voucher.id);

    if (updateError)
      return res.status(500).json({ error: "Error issuing voucher" });

    res.json({ voucherCode: voucher.voucher_code });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
