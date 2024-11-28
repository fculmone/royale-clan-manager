import { Suspense } from "react";
import Header from "../ui/header";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <Suspense>
        <Header />
        <div className="mt-12 text-center">
          <p className="mt-10 mb-6 font-bold text-2xl text-center">
            Privacy Policy
          </p>
          <div className="w-full text-left px-2">
            <p className="mb-9">
              By using the Royale Clan Manager website, you agree to and accept
              the following.
            </p>
            <ul className="list-disc list-inside max-w-[621px]">
              <li className="mb-3">
                Third-party vendors, including Google, use cookies to serve ads
                based on the user&apos;s prior visits to this website and other
                websites.
              </li>
              <li className="mb-3">
                Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visits to this site
                and other sites across the internet.
              </li>
              <li className="mb-3">
                You may choose to opt out of personalized advertising from
                Google by visiting&nbsp;
                <a
                  href="https://myadcenter.google.com/personalizationoff?sasb=true&ref=ad-settings"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Ads Settings
                </a>
                .
              </li>
              <li className="mb-3">
                Google Analytics is used on this site to collect data. This data
                is utilized to track the number of visitors on this website. It
                will not be utilized for any other marketing purposes besides by
                Google for advertisements on this website, which can be turned
                off using the link in the above list item.
              </li>
            </ul>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
