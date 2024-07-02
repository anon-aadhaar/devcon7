import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../supabaseAdmin";
import {
  verify,
  init,
  artifactUrls,
  ArtifactsOrigin,
  InitArgs,
  AnonAadhaarCore,
} from "@anon-aadhaar/core";

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

    const verified = await verify(anonAadhaarProof);
    const nullifier = anonAadhaarProof.proof.nullifier;

    if (!verified)
      return res
        .status(401)
        .json({ error: "Unauthorized, your proof is not valid." });

    // Check if the user has already claimed a voucher
    const { data: existingVoucher, error: existingVoucherError } =
      await supabaseAdmin
        .from("vouchers")
        .select("voucher_code")
        .eq("nullifier", nullifier)
        .single();

    if (existingVoucher)
      return res.status(409).json({ error: "Voucher already issued" });

    // Fetch an available voucher
    const { data: voucher, error: voucherError } = await supabaseAdmin
      .from("vouchers")
      .select("id, voucher_code")
      .is("nullifier", null)
      .limit(1)
      .single();

    if (voucherError || !voucher)
      return res.status(404).json({ error: "No vouchers available" });

    // Update the voucher with the user's unique identifier
    const { error: updateError } = await supabaseAdmin
      .from("vouchers")
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
