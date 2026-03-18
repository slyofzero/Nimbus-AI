"use client";
import { useGlobalStates } from "@/state";
import { useEffect, useMemo, useState } from "react";
import {
  PaymentDetail,
  PaymentModal,
  PaymentVerificationDetail,
} from "./Modal/PaymentModal";
import { clientFetcher, clientPoster } from "@/utils/api";
import { sleep } from "@/utils/time";
import { ShowWhen } from "./utils";
import {
  InstanceType,
  Locations,
  OSTypes,
  instanceLocations,
  instanceTypeOS,
  instanceTypes,
} from "@/data";
import { InstanceTypeComp } from "./dashboard/InstanceType";
import { InstanceLocation } from "./dashboard/InstanceLocation";
import { InstanceOS } from "./dashboard/InstanceOS";
import { instancePlans } from "@/data/instances/plan";
import { InstancePlan } from "./dashboard/InstancePlan";
import { classNames } from "@/utils/styling";

export function DeployInstanceButton() {
  const { setShowInstances, showInstances } = useGlobalStates();

  function onClick() {
    setShowInstances((prev) => !prev);
  }

  return (
    <button
      onClick={onClick}
      className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-input bg-[#1047DC] shadow-[0px_0px_1px_1px_var(--neutral-800)] !bg-default max-w-fit bg-opacity-90 mt-4"
    >
      {showInstances ? "Deploy Instance" : "Cancel Instance"}
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></span>
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></span>
    </button>
  );
}

export function DeployInstance() {
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { setShowInstances } = useGlobalStates();
  const [paymentStatus, setPaymentStatus] = useState<
    "verifying" | "verified" | "failed" | "deploying" | "rejected" | null
  >();
  const { deployInstance } = useGlobalStates();
  const allDeployInstanceFieldsFills = useMemo(
    () => Object.values(deployInstance).every((value) => Boolean(value)),
    [deployInstance],
  );

  useEffect(() => {
    if (!showPaymentModal) setPaymentStatus(null);
  }, [showPaymentModal]);

  async function deployInstanceRequest() {
    if (!allDeployInstanceFieldsFills) return;
    setPaymentStatus("deploying");
    console.log(deployInstance);
    const data = (
      await clientPoster<PaymentDetail>("/api/payment", deployInstance)
    ).data;

    setPaymentDetail(data);
    setShowPaymentModal(true);
  }

  async function verifyPayment() {
    if (paymentStatus && paymentStatus !== "deploying") return;

    setPaymentStatus("verifying");
    let attempt = 0;

    for (const attempt_number of Array.from(Array(20).keys())) {
      attempt = attempt_number + 1;

      const data = await clientFetcher<PaymentVerificationDetail>(
        `/api/payment/${paymentDetail?.hash}`,
      );

      if (data.response === 200) break;
      await sleep(5000);
    }

    if (attempt < 20) {
      setPaymentStatus("verified");
      await sleep(5000);
      setShowInstances(true);
      setShowPaymentModal(false);
    } else setPaymentStatus("failed");
  }

  const verifyPaymentBtnText = useMemo(() => {
    if (paymentStatus === "verifying") return "Checking...";
    else if (paymentStatus === "verified") return "Verified";
    else if (paymentStatus === "failed") return "Failed";
    else return "I have paid";
  }, [paymentStatus]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden p-4">
      <ShowWhen
        show={
          <PaymentModal
            setShowPaymentModal={setShowPaymentModal}
            verifyPayment={verifyPayment}
            paymentDetail={paymentDetail}
            btnText={verifyPaymentBtnText}
          />
        }
        when={showPaymentModal}
      />

      <h1 className="pl-10 py-5 text-left w-full text-4xl font-bold">
        Deploy New Instance
      </h1>

      <div className="w-full mt-14">
        <h2 className="text-2xl">Choose Type</h2>
        <div className="flex flex-row gap-x-4 gap-y-2 pt-6 flex-wrap lg:flex-nowrap lg:gap-y-0">
          {Object.entries(instanceTypes).map(([key, value]) => (
            <InstanceTypeComp key={key} {...value} type={key as InstanceType} />
          ))}
        </div>
      </div>
      <div className="w-full mt-14">
        <h2 className="text-2xl">Choose Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
          {Object.entries(instanceLocations).map(([key, value]) => (
            <InstanceLocation
              key={key}
              {...value}
              location={key as Locations}
            />
          ))}
        </div>
      </div>
      <div className="w-full mt-14">
        <h2 className="text-2xl">Choose Operation System</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
          {Object.entries(instanceTypeOS[deployInstance.type]).map(
            ([key, value]) => (
              <InstanceOS key={key} {...value} os={key as OSTypes} />
            ),
          )}
        </div>
      </div>
      <div className="w-full mt-14">
        <h2 className="text-2xl">Choose Plan</h2>

        <div className="overflow-x-auto">
          <table className="w-full rounded border border-neutral-800 mt-6 overflow-auto">
            <thead>
              <tr className="flex flex-row items-center p-2 border-b border-neutral-800 gap-16 md:gap-0">
                <th className="w-full text-left text-sm text-zinc-400">Name</th>
                <th className="w-full text-left text-sm text-zinc-400">
                  Cores
                </th>
                <th className="w-full text-left text-sm text-zinc-400">
                  Memory
                </th>
                {/* <th className="w-full text-left text-sm text-zinc-400">Storage</th> */}
                <th className="w-full text-left text-sm text-zinc-400">
                  Bandwidth
                </th>
                <th className="w-full text-left text-sm text-zinc-400">
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(instancePlans[deployInstance.type]).map(
                ([key, value]) => (
                  <InstancePlan key={key} {...value} plan={key} />
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full flex justify-end items-center mt-12 px-4 mb-8 sm:mb-0">
        <button
          className={classNames(
            "z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-unit-20 h-unit-10 text-small gap-unit-2 [&amp;>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none  text-primary-foreground data-[hover=true]:opacity-hover max-w-fit px-8 rounded py-2 text-sm",
            allDeployInstanceFieldsFills
              ? "bg-primary cursor-pointer"
              : "cursor-default",
          )}
          type="button"
          onClick={deployInstanceRequest}
        >
          {paymentStatus === "deploying" ? "Preparing..." : "Deploy"}
        </button>
      </div>
    </div>
  );
}
