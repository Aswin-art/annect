import React from "react";
import Link from "next/link";

type Props = {};

const Footer = (props: Props) => {
  return (
      <footer className="footer bg-gray-900 relative text-gray-200 dark:text-gray-200 mt-52">
          <div className="container">
              <div className="grid grid-cols-1">
                  <div className="relative py-16">
                      <div className="relative w-full">
                          <div
                              className="relative -top-40 bg-white dark:bg-slate-900 lg:px-8 px-6 py-10 rounded-xl shadow-xl border-2 border-slate-300 dark:shadow-gray-800 overflow-hidden">
                              <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-[30px]">
                                  <div className="md:text-start text-center z-1">
                                      <h3 className="text-[26px] font-semibold text-slate-900 dark:text-white">
                                          {" "}
                                          Subscribe to Event Updates!
                                      </h3>
                                      <p className="text-slate-400 max-w-xl mx-auto">
                                          {" "}
                                          Stay updated on the latest events, ticket drops, and
                                          exclusive offers. Get notified and secure your NFT
                                          tickets before they sell out!
                                      </p>
                                  </div>

                                  <div className="subcribe-form z-1">
                                      <form className="relative max-w-lg md:ms-auto">
                                          <input
                                              type="email"
                                              id="subcribe"
                                              name="email"
                                              className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] border outline-none border-slate-400 text-slate-900 dark:text-white rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800"
                                              placeholder="Enter your email :"
                                          />
                                          <button
                                              type="submit"
                                              className="btn absolute top-[2px] end-[3px] h-[46px] bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-md"
                                          >
                                              Subscribe
                                          </button>
                                      </form>
                                  </div>
                              </div>

                              <div className="absolute -top-5 -start-5">
                                  <div
                                      className="uil uil-envelope lg:text-[150px] text-7xl text-slate-900/5 dark:text-white/5 -rotate-45"></div>
                              </div>

                              <div className="absolute -bottom-5 -end-5">
                                  <div
                                      className="uil uil-pen lg:text-[150px] text-7xl text-slate-900/5 dark:text-white/5"></div>
                              </div>
                          </div>

                          <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px] -mt-24">
                              <div className="lg:col-span-4 md:col-span-12">
                                  <a href="#" className="text-[22px] focus:outline-none">
                                      <img
                                          src="/festiva/logo-name.png"
                                          className={`max-w-32`}
                                          alt=""
                                      />
                                  </a>
                                  <p className="mt-6 text-gray-300">
                                      Online Festiva platform with Blockchain technology.
                                  </p>
                              </div>

                              <div className="lg:col-span-2 md:col-span-4">
                                  <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">
                                      Festiva Menu
                                  </h5>
                                  <ul className="list-none footer-list mt-6">
                                      <li>
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i> Explore
                                              Item
                                          </Link>
                                      </li>
                                      <li className="mt-[10px]">
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i> List of
                                              Organizers
                                          </Link>
                                      </li>
                                      <li className="mt-[10px]">
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i>{" "}
                                              Register as Organizer
                                          </Link>
                                      </li>
                                      <li className="mt-[10px]">
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i> Create
                                              an Event
                                          </Link>
                                      </li>
                                  </ul>
                              </div>

                              <div className="lg:col-span-3 md:col-span-4">
                                  <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">
                                      Service
                                  </h5>
                                  <ul className="list-none footer-list mt-6">
                                      <li>
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i> Call
                                              Center
                                          </Link>
                                      </li>
                                      <li className="mt-[10px]">
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i> Report
                                              an Event
                                          </Link>
                                      </li>
                                      <li className="mt-[10px]">
                                          <Link
                                              href=""
                                              className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                          >
                                              <i className="uil uil-angle-right-b me-1"></i>{" "}
                                              Frequenly Asked Questions
                                          </Link>
                                      </li>
                                  </ul>
                              </div>

                              <div className="lg:col-span-3 md:col-span-4">
                                  <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">
                                      Contact
                                  </h5>

                                  <div className="mt-6">
                                      <h5 className="tracking-[1px] text-lg text-gray-100 font-semibold">
                                          Contact
                                      </h5>

                                      <div className="flex mt-6">
                                          <i
                                              data-feather="mail"
                                              className="w-5 h-5 text-violet-600 me-3 mt-1"
                                          ></i>
                                          <div className="">
                                              <a
                                                  href="mailto:festiva@gmail.com"
                                                  className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                              >
                                                  cs@festiva.co.id
                                              </a>
                                          </div>
                                      </div>

                                      <div className="flex mt-6">
                                          <i
                                              data-feather="phone"
                                              className="w-5 h-5 text-violet-600 me-3 mt-1"
                                          ></i>
                                          <div className="">
                                              <a
                                                  href="tel:+6288888888"
                                                  className="text-[16px] text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                              >
                                                  +62 888 8888 888
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="py-[30px] px-0 border-t border-gray-800 dark:border-gray-700">
              <div className="container text-center">
                  <div className="grid md:grid-cols-2 items-center gap-6">
                      <div className="md:text-start text-center">
                          <p className="mb-0 text-gray-300">
                              &copy; {new Date().getFullYear()} 
                              {" "}
                              &copy; {new Date().getFullYear()} | All rights reserved
                          </p>
                      </div>

                      <ul className="list-none md:text-end text-center">
                          <li className="inline">
                              <a
                                  href="http://linkedin.com/company/shreethemes"
                                  target="_blank"
                                  className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"
                              >
                                  <i className="uil uil-linkedin" title="Linkedin"></i>
                              </a>
                          </li>
                          <li className="inline">
                              <a
                                  href="https://www.facebook.com/shreethemes"
                                  target="_blank"
                                  className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"
                              >
                                  <i
                                      className="uil uil-facebook-f align-middle"
                                      title="facebook"
                                  ></i>
                              </a>
                          </li>
                          <li className="inline">
                              <a
                                  href="https://www.instagram.com/shreethemes/"
                                  target="_blank"
                                  className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"
                              >
                                  <i
                                      className="uil uil-instagram align-middle"
                                      title="instagram"
                                  ></i>
                              </a>
                          </li>
                          <li className="inline">
                              <a
                                  href="https://x.com/shreethemes"
                                  target="_blank"
                                  className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"
                              >
                                  <i
                                      className="uil uil-twitter align-middle"
                                      title="twitter"
                                  ></i>
                              </a>
                          </li>
                          <li className="inline">
                              <a
                                  href="mailto:support@shreethemes.in"
                                  className="btn btn-icon btn-sm border border-gray-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"
                              >
                                  <i
                                      className="uil uil-envelope align-middle"
                                      title="email"
                                  ></i>
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </footer>
  );
};

export default Footer;