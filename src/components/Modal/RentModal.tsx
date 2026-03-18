import { useState } from "react";
import { Modal } from "../Modal";

export function RentModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Modal setShowModal={setShowModal}>
      <header
        className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1 mb-4"
        id=":ri:"
      >
        <h2 className="font-bold text-xl text-neutral-200">
          Rent with NodeNet
        </h2>
        <p className="text-sm max-w-sm mt-2 font-normal text-neutral-300">
          After submitting a rental request, you will be contacted by a
          representative to confirm and process your order.
        </p>
      </header>
      <div className="flex flex-1 flex-col gap-3 px-6 py-2 mb-8" id=":rj:">
        <label className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Server Location
        </label>
        <div
          className="p-[2px] rounded-lg transition duration-300 group/input"
          style={{
            background:
              "radial-gradient(0px circle at 0px 0px, var(--purple-600), transparent 80%)",
          }}
        >
          <select className="flex h-10 w-full border-none bg-zinc-800 text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400">
            <option value="us">United States</option>
          </select>
        </div>
        <div className="flex flex-col space-y-2 w-full mb-4">
          <label className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Telegram Username
          </label>
          <div
            className="p-[2px] rounded-lg transition duration-300 group/input"
            style={{
              background:
                "radial-gradient(0px circle at 0px 0px, var(--purple-600), transparent 80%)",
            }}
          >
            <input
              className="flex h-10 w-full border-none bg-zinc-800 text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
              id="tg-username"
              placeholder="@username"
              value=""
            />
          </div>
        </div>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full"></div>
        <button className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-input bg-[#1047DC] shadow-[0px_0px_1px_1px_var(--neutral-800)] mr-2">
          <div className="v-centered">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-link2 mr-1"
            >
              <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
              <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
              <line x1="8" x2="16" y1="12" y2="12"></line>
            </svg>
            Connect Wallet
          </div>
          <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></span>
          <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></span>
        </button>
      </div>
      <div
        style={{
          border: "0px",
          clip: "rect(0px, 0px, 0px, 0px)",
          clipPath: "inset(50%)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: "0px",
          position: "absolute",
          width: "1px",
          whiteSpace: "nowrap",
        }}
      >
        <button
          id="react-aria5441171583-:rr:"
          aria-label="Dismiss"
          tabIndex={-1}
        ></button>
      </div>
    </Modal>
  );
}
