import { addDocument, getDocument, updateDocumentById } from "@/config";
import { web3 } from "@/config/rpc";
import { StoredInstance, StoredOrder } from "@/types";
import { validateAuth } from "@/utils/auth";
import { log } from "@/utils/handlers";
import { createInstance } from "@/utils/aws";
import { CLOUD_AWS_ACCESS_KEY, CLOUD_AWS_ACCESS_KEY_ID } from "@/utils/env";
import AWS from "aws-sdk";
import { awsLocations } from "@/data/aws";
import { Timestamp } from "firebase-admin/firestore";

interface Params {
  hash: string;
}

export async function GET(req: Request, context: { params: Params }) {
  const user = await validateAuth(req);
  const { hash } = context.params;

  const orderInformation = (
    await getDocument<StoredOrder>({
      collectionName: "orders",
      queries: [["hash", "==", hash]],
    })
  ).at(0);

  if (!orderInformation)
    return Response.json({ message: "No order information" }, { status: 400 });
  else if (user !== orderInformation.user)
    return Response.json(
      { message: "User and order creator mismatch" },
      { status: 401 },
    );

  const { sentTo, toPay, location, id: orderId } = orderInformation;

  // ---------- Checking payment ----------
  console.debug(`ORder - ${orderInformation.sentTo}`);
  const balance = await web3.eth.getBalance(sentTo);
  console.debug(`Balance - ${balance}`);

  if (balance < Number(web3.utils.toWei(toPay, "ether"))) {
    log(`Transaction amount doesn't match`);
    return Response.json({ message: "Payment not verified" }, { status: 402 });
  }

  const currentTimestamp = Timestamp.now();
  updateDocumentById<StoredOrder>({
    collectionName: "orders",
    updates: { status: "PAID", paidAt: currentTimestamp },
    id: orderId || "",
  });

  console.log(CLOUD_AWS_ACCESS_KEY_ID, CLOUD_AWS_ACCESS_KEY);

  // ---------- Creating instance ----------
  AWS.config.update({
    accessKeyId: CLOUD_AWS_ACCESS_KEY_ID,
    secretAccessKey: CLOUD_AWS_ACCESS_KEY,
    region: awsLocations[location],
  });

  const ec2 = new AWS.EC2();
  const instance = await createInstance(ec2, orderInformation);

  if (!instance)
    return Response.json(
      { message: "Error in creating an instance" },
      { status: 400 },
    );

  addDocument<StoredInstance>({
    collectionName: "instances",
    data: {
      hash,
      status: "ACTIVE",
      user,
      location,
      plan: orderInformation.plan,
      type: orderInformation.type,
      terminatesAt: new Timestamp(
        currentTimestamp.seconds + 30 * 24 * 60 * 60,
        currentTimestamp.nanoseconds,
      ),
      ...instance,
    },
  });

  return Response.json({ message: "Success", instance });
}
