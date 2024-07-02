import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../supabaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { nullifier } = req.body;

    // Check if the user has already claimed a voucher
    const { data: existingVoucher, error: existingVoucherError } =
      await supabaseAdmin
        .from("vouchers")
        .select("voucher_code")
        .eq("nullifier", nullifier)
        .single();

    if (existingVoucher) {
      return res.json({
        redeemed: true,
        voucherCode: existingVoucher.voucher_code,
      });
    } else if (existingVoucherError) {
      return res.status(500).json({ error: "Error checking voucher status" });
    } else {
      return res.json({ redeemed: false });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
