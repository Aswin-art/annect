"use server";

export const getDashboardData = async () => {
  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/dashboard"
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
