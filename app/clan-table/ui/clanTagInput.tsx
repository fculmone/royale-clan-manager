//import {SetStateAction, useState} from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { getDataFromServer } from "../../lib/data";
import BasicTable from "./table";
import TableWithClanInput from "./tableWithClanInput";

export default function ClanTagInput({ defaultValue: string }) {
  //const [searchInput, setSearchInput] = useState("");

  function writeStuff() {
    //setSearchInput(event.target.value);
  }

  async function search(formData: any) {
    "use server";
    const query = formData.get("query");
    //TODO add search logic
    const response = await getDataFromServer(query.toString());
    //console.log(response);
  }

  return (
    <form action={search}>
      <input name="query" type="text" placeholder="Enter Your Clan Tag" />
      <button type="submit">Search</button>
    </form>
  );
}
