"use server";

export const getBrowseData = async () => {
  try {
    const getTags = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/tags");
    const getCategories = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/categories"
    );
    const getEvents = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/events"
    );

    const tagRes = await getTags.json();
    const categoryRes = await getCategories.json();
    const eventRes = await getEvents.json();

    const data = {
      tags: tagRes,
      categories: categoryRes,
      events: eventRes,
    };

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const filter = async () => {};
