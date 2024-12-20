import { ethers } from "ethers";
import ABI from "@/constants/abi.json";

const DEFAULT_RPC_URL = process.env.NEXT_PUBLIC_WEB3_RPC_URL ?? "";
const DEFAULT_ADDRESS_URL = process.env.NEXT_PUBLIC_WEB3_ADDRESS_URL ?? "";

const provider = new ethers.JsonRpcProvider(DEFAULT_RPC_URL);

if (!provider)
  throw new Error(
    "RPC URL is not defined. Set NEXT_PUBLIC_WEB3_RPC_URL in your environment variables."
  );

const contract = new ethers.Contract(DEFAULT_ADDRESS_URL, ABI, provider);

if (!contract) throw new Error("Contract is not defined.");

const dateToWei = (date: Date): string => {
  const timestamp = Math.floor(date.getTime() / 1000);
  return ethers.parseUnits(timestamp.toString(), "wei").toString();
};

export const verifyWhitelist = async (address: string) => {
  const req = await contract.addWhitelistedCreator(address);

  return req;
};

export const createEvent = async (
  name: string,
  date: Date,
  priceUSD: number,
  capacity: number
) => {
  const weiTimestamp = dateToWei(date);

  const data = {
    _name: name,
    _date: weiTimestamp,
    _priceUSD: priceUSD,
    _capacity: capacity,
  };

  const req = await contract.createEvent(data);

  return req;
};

export const editEvent = async (
  eventId: number,
  date: Date,
  priceUSD: number,
  capacity: number
) => {
  const weiTimestamp = dateToWei(date);

  const data = {
    _eventId: eventId,
    _newDate: weiTimestamp,
    _newPriceUSD: priceUSD,
    _newCapacity: capacity,
  };

  const req = await contract.editEvent(data);

  return req;
};

export const buyTicketWithToken = async (eventId: number) => {
  const data = {
    _eventId: eventId,
  };

  const req = await contract.buyTicketWithToken(data);

  return req;
};

export const buyTicketWithETH = async (amount: number, eventId: number) => {
  const data = {
    buyTicketWithETH: amount,
    _eventId: eventId,
  };

  const req = await contract.buyTicketWithETH(data);

  return req;
};

export const withdrawEventFunds = async (eventId: number) => {
  const data = {
    _eventId: eventId,
  };

  const req = await contract.withdrawEventFunds(data);

  return req;
};

export const events = async () => {
  const req = await contract.getAllEvents();

  return req;
};

export const eventDetail = async (id: number) => {
  const req = await contract.events(id);

  return req;
};
