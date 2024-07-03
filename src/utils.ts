import { AnonAadhaarCore } from "@anon-aadhaar/core";

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function checkIfRedeemed(nullifier: string) {
  const response = await fetch("/api/check-redeemed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nullifier }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}

export async function checkVoucherAvailability() {
  const response = await fetch("/api/check-availability", {
    method: "GET",
    headers: {},
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}

export async function sendRedeemRequest(anonAadhaarProof: AnonAadhaarCore) {
  const response = await fetch("/api/redeem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ anonAadhaarProof }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}
