import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../supabaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Check if there are any available vouchers
    const { data: availableVoucher, error: voucherError } = await supabaseAdmin
      .from("Vouchers")
      .select("id")
      .is("nullifier", null)
      .limit(1)
      .single();

    if (availableVoucher) {
      return res.json({ available: true });
    } else if (voucherError) {
      return res
        .status(500)
        .json({ error: "Error checking voucher availability" });
    } else {
      return res.json({ available: false });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
