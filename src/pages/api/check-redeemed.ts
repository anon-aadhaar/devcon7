import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../supabaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { nullifier } = req.body;

    try {
      // Check if the user has already claimed a voucher
      const { data: existingVoucher, error: existingVoucherError } =
        await supabaseAdmin
          .from("Vouchers")
          .select("voucher_code")
          .eq("nullifier", nullifier)
          .single();

      if (
        existingVoucherError &&
        existingVoucherError.details.includes("0 rows")
      ) {
        // No voucher found for this nullifier
        return res.json({ redeemed: false });
      } else if (existingVoucherError) {
        // Other errors
        return res.status(500).json({ error: "Error checking voucher status" });
      } else {
        // Voucher found
        return res.json({
          redeemed: true,
          voucherCode: existingVoucher.voucher_code,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error checking voucher status" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
