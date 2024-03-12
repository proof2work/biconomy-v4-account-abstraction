"use client"

import { useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"

const tiers = [
  {
    name: "Buy ERC20 with ERC20",
    id: "tier-freelancer",
    href: "#",
    price: { monthly: "$15", annually: "$144" },
    description: "The essentials to provide your best work for clients.",
  },
  {
    name: "Mint NFT without paying gas",
    id: "tier-startup",
    href: "#",
    price: { monthly: "$30", annually: "$288" },
    description: "A plan that scales with your rapidly growing business.",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    price: { monthly: "$60", annually: "$576" },
    description: "Dedicated support and infrastructure for your company.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 ">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Biconomy SDK v4</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Account Abstraction by Examples
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-gray-300">
            Let's explore how to implement account abstraction in your dapp with Biconomy
          </p>
          <div className="flex justify-center items-center my-10 gap-10">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={clsx(
                  tier.mostPopular
                    ? "bg-white/5 ring-2 ring-indigo-500"
                    : "ring-1 ring-white/10",
                  "rounded-3xl p-8 xl:p-10"
                )}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3 id={tier.id} className="text-lg font-semibold leading-8 text-white">
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={clsx(
                    tier.mostPopular
                      ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                      : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                    "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  )}
                >
                  See Demo
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
