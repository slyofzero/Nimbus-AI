import { addDocument } from "@/config";
import { instancePlans } from "@/data/instances/plan";
import { DeployInstance, StoredOrder } from "@/types";
import { apiFetcher } from "@/utils/api";
import { validateAuth } from "@/utils/auth";
import { ethPriceApi } from "@/utils/constants";
import { getUnlockedAccount } from "@/utils/web3";
import { log } from "console";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = (await req.json()) as DeployInstance;
  const user = await validateAuth(req);

  if (!body.location || !body.os || !body.plan || !body.type)
    return Response.json(
      { message: "All fields are required" },
      { status: 400 },
    );

  const address = await getUnlockedAccount();
  const hash = nanoid(10);
  const priceUsd = instancePlans[body.type][body.plan].price;
  const ethPrice = (await apiFetcher<any>(ethPriceApi)).data.ethereum.usd;
  log(`Eth Price - ${ethPrice}`);
  const toPay = parseFloat((priceUsd / ethPrice).toFixed(8)) || 0;

  addDocument<StoredOrder>({
    collectionName: "orders",
    data: {
      ...body,
      hash,
      sentTo: address,
      status: "PENDING",
      plan: body.plan,
      toPay,
      user,
    },
    id: hash,
  });

  return Response.json({ address, hash, toPay });
}
