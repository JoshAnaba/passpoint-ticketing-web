import moreInfoBg from '@/assets/more-info-bg-image.jpg'
import PasspointLogo from './PasspointLogo';
import clsx from 'clsx';

const PoweredBy = ({ className = "" }) => (
  <div className={clsx("mt-8 flex justify-center", className)}>
    <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
      <span className="text-sm">Powered by</span>
      <PasspointLogo fill="#fff" />
      {/* <span className="font-bold text-lg">Passpoint</span> */}
    </div>
  </div>
)
const Footer = () => {
  return (
    <footer
      className="px-4 py-12 relative"
      style={{
        backgroundImage: `url(${moreInfoBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <PoweredBy className="absolute top-0 left-4 hidden lg:block" />
      {/* Overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-black/40"></div> */}

      {/* Content with relative positioning to appear above overlay */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              More About The Africa Blockchain Festival 2025
            </h2>

            <div className="space-y-6 text-gray-700">
              <p className="leading-relaxed">
                Join 3,000+ leaders, innovators, and policymakers in Kigali, Rwanda, for Africa's premier tech event focused on blockchain, AI, policy, and investment. Shift the narrative, build the future.
              </p>

              <p className="leading-relaxed">
                The Africa Blockchain Festival (ABF) 2025 is set to be a landmark international event, taking place from November 7-9, 2025, in the vibrant city of Kigali, Rwanda.
              </p>

              <p className="leading-relaxed">
                Beyond a traditional conference, ABF 2025 is a movement designed to fundamentally shift the global narrative of Africa from a tech consumer to a leading innovator in the digital economy.
              </p>

              <div className="mt-8">
                <h3 className="text-base font-normal text-gray-900 mb-4">Why Attend ABF 2025?</h3>
                <ul className="space-y-3 list-disc pl-5">
                  <li>
                    <h6 className="inline text-gray-900">Unlocking Africa's Potential:</h6>
                    <span className="text-gray-700"> Discover how Blockchain at its core, accelerated by AI, is driving transformative change across industries and public infrastructure in Africa. Our focus is on real technology, real-world applications, and tangible impact.</span>
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Connect with 5,000+ Global Leaders:</h6>
                    <span className="text-gray-700"> Engage with a high-caliber audience of entrepreneurs, developers, institutional investors, policymakers, central bank governors, and tech visionaries from across Africa and around the world.</span>
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Shape the Future of Policy:</h6>
                    <span className="text-gray-700"> Participate in high-level policy discussions and roundtables aimed at fostering progressive regulatory frameworks for AI and Blockchain, culminating in a published communique to guide governments.</span>
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Facilitate Deal-Making & Investment:</h6>
                    <span className="text-gray-700"> Connect directly with a curated pipeline of promising African blockchain and AI startups seeking capital and strategic partnerships. ABF is a platform for value creation that attracts serious investors.</span>
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Experience Kigali's Innovation:</h6>
                    <span className="text-gray-700"> Immerse yourself in Rwanda's dynamic tech ecosystem, a nation leading in digital transformation and home to a burgeoning AI hub supported by the Gates Foundation.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="mb-4">What to Expect:</h3>
                <ul className="space-y-3 list-disc pl-5">
                  <li>
                    <h6 className="inline text-gray-900">Inspiring Keynotes:</h6> Hear from global thought leaders and African visionaries.
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Dynamic Panel Sessions:</h6> Dive deep into topics like AI accelerating Web3, building LLMs for African languages, stablecoins for financial inclusion, and attracting institutional investment.
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Interactive Hackathon:</h6> Witness African developer talent in action, building real-world solutions.
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Vibrant Exhibition:</h6> Explore booths from 40+ leading companies, startups, and service providers.
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Curated Networking:</h6> Engage in targeted sessions, exclusive receptions, and a dedicated Deal Room to foster meaningful connections.
                  </li>
                  <li>
                    <h6 className="inline text-gray-900">Kigali Innovation Tour:</h6> Discover the city's tech hubs, heritage sites, and vibrant culture on Day 3.
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="font-normal mb-4">Who Should Attend:</h3>
                <ul className="space-y-3 list-disc pl-5">
                  <li>
                    Blockchain & AI Developers and Engineers
                  </li>
                  <li>
                    Startup Founders & Entrepreneurs
                  </li>
                  <li>
                    Venture Capitalists & Angel Investors
                  </li>
                  <li>
                    Financial Institutions & Fintech Professionals
                  </li>
                  <li>
                    Government Officials & Policymakers
                  </li>
                  <li>
                    Academics & Researchers
                  </li>
                  <li>
                    Anyone passionate about Africa's digital future!
                  </li>
                </ul>
              </div>

              <div className="mt-2 px-0 rounded-lg">
                <p className="">
                  Join us in Kigali and be a part of the movement that is building Africa's future, one innovation at a time.
                </p>
              </div>

              <div className="mt-2 pt-2">
                <div className="">
                  <div>
                    <p>
                      <span className="">Date: </span>
                      <span className="text-gray-700">November 7-9, 2025</span>
                    </p>
                  </div>
                  <div>
                    <p>  <span className="">Location: </span>
                      <span className="text-gray-700">Kigali Convention Centre, Kigali, Rwanda</span></p>
                  </div>
                </div>
              </div>

              <div className="">
                <p className="">
                  Register now and secure your place at Africa's Blockchain Renaissance!
                </p>
              </div>
            </div>
          </div>

          {/* Powered by section */}
          <PoweredBy className='lg:hidden absolute bottom-[-20px] left-0' />
        </div>
      </div>
    </footer>
  );
};

export default Footer;