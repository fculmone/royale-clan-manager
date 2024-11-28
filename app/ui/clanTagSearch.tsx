import { Dispatch, SetStateAction } from "react";

export function ClanTagSearch({
  handleSearch,
  isLoading,
  setIsLoading,
  prevValue,
}: {
  handleSearch: Function;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  prevValue: string | undefined;
}) {
  //const [searchInput, setSearchInput] = useState(});

  function writeStuff() {
    //setSearchInput(event.target.value);
  }

  function search(formData: any) {
    //console.log("in search function");
    let response: string = formData.get("query");
    response = response.toUpperCase();
    response = response.replace(/\s+/g, "");
    //console.log(response);
    if (response.charAt(0) == "#") {
      response = response.slice(1);
    }
    setIsLoading(true);
    handleSearch(response);
  }

  return (
    <form action={search} className="block w-full whitespace-nowrap">
      <input
        name="query"
        type="text"
        placeholder={isLoading ? "Loading..." : "Enter Clan Tag (Ex. Q8UGY2V2)"}
        defaultValue={isLoading ? "" : prevValue}
        disabled={isLoading}
        className="bg-white border-solid border-gray-300 px-3 w-full max-w-72 h-8 rounded-l-md border disabled:text-white disabled:hover:cursor-wait"
      />
      <button
        className="disabled:hover:bg-white disabled:hover:cursor-wait disabled:opacity-55 hover:bg-gray-200 bg-white border px-3 h-8 -ml-[1px] rounded-r-md"
        disabled={isLoading}
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
