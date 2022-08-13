import Image from "next/image";
import Link from "next/link";
import logo from "../../public/imgs/logo.png";

function Footer() {
  return (
    <footer className="">
      <div className="bg-primary pt-4">
        <div className="mycontainer">
          <div className="flex flex-col items-start justify-between lg:flex-row">
            <div className="my-2 w-full font-light text-white lg:my-0 lg:w-1/4">
              <div className="w-[200px]">
                <Image src={logo} alt="metalcharts" placeholder="blur" />
              </div>
              <p>support@metalcharts.net</p>
            </div>

            <div className="my-2 w-full lg:my-0 lg:ml-4 lg:w-1/4">
              <h3 className="text-xl font-medium text-yellow-500">About us</h3>
              <div className="flex flex-col">
                <Link href="/Privacy-Policy">
                  <a className="nav-item">Privacy Policy</a>
                </Link>

                <Link href="/Terms">
                  <a className="nav-item">Terms of Service</a>
                </Link>

                <Link href="/">
                  <a className="nav-item">Contact Support</a>
                </Link>
              </div>
            </div>

            <div className="my-2 w-full lg:my-0 lg:w-1/4">
              <h3 className="text-xl font-medium text-yellow-500">
                Social Handles
              </h3>
              <div className="flex flex-col">
                <Link href="https://wa.link/3ypjta">
                  <a className="nav-item" target="_blank">
                    WhatsApp
                  </a>
                </Link>

                <Link href="https://t.me/MetalChartsVIP">
                  <a className="nav-item" target="_blank">
                    Telegram
                  </a>
                </Link>

                <Link href="https://www.instagram.com/metal_charts/">
                  <a className="nav-item" target="_blank">
                    Instagram
                  </a>
                </Link>

                <Link href="https://twitter.com/MetalCharts">
                  <a className="nav-item" target="_blank">
                    Twitter
                  </a>
                </Link>
              </div>
            </div>

            <div className="my-2 w-full lg:my-0 lg:w-1/4">
              <h3 className="text-lg font-medium text-yellow-500">
                Useful Links
              </h3>
              <div className="flex flex-col">
                <Link href="/user/Buy">
                  <a className="nav-item">Buy Gold</a>
                </Link>

                <Link href="/user/Buy">
                  <a className="nav-item">Buy Brent Crude Oil</a>
                </Link>

                <Link href="/Faqs">
                  <a className="nav-item">FAQs</a>
                </Link>
              </div>
            </div>
          </div>

          <p className="bg-primary mt-2 border-t border-slate-400 py-1 text-center font-light text-white">
            © MetalCharts 2022. All Rights Reserved. SoftTech Global.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
