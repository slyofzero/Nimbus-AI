import { addDocument, getDocument, updateDocumentById } from "@/config";
import { Timestamp } from "firebase-admin/firestore";
import { encrypt } from "./crypto";
import { StoredAccount } from "@/types";
import { ethers } from "ethers";

export function generateAccount() {
  const wallet = ethers.Wallet.createRandom();

  const data = {
    publicKey: wallet.address,
    secretKey: wallet.privateKey,
  };
  return data;
}

export async function getUnlockedAccount() {
  let publicKey: string = "";

  const notLockedAccount = (
    await getDocument<StoredAccount>({
      collectionName: "accounts",
      queries: [["locked", "!=", true]],
    })
  ).at(0);

  if (notLockedAccount) {
    publicKey = notLockedAccount.publicKey;
    updateDocumentById({
      id: notLockedAccount.id || "",
      collectionName: "accounts",
      updates: { locked: true, lockedAt: Timestamp.now() },
    });
  } else {
    const newAccount = generateAccount();
    publicKey = newAccount.publicKey;

    console.log(`Test - ${publicKey}`);
    const newAccountData: StoredAccount = {
      publicKey,
      secretKey: encrypt(newAccount.secretKey),
      locked: true,
      lockedAt: Timestamp.now(),
    };

    console.log(`Test - ${newAccountData}`);

    addDocument({ data: newAccountData, collectionName: "accounts" });
  }

  return publicKey;
}
