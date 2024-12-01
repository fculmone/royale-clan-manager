export function ClanNameSearch({ defaultValue }) {
  function search(formData: any) {
    //console.log("in search function");
    let response: string = formData.get("query");
    let url: string =
      "/clan-search/?clan-name=" + encodeURI(response).replace("#", "%23");
    window.location.href = url;
  }

  return (
    <form action={search} className="block w-full whitespace-nowrap">
      <input
        name="query"
        type="text"
        placeholder="Search by Clan Name"
        className="bg-white border-solid border-gray-300 px-3 w-full max-w-72 h-8 rounded-l-md border disabled:text-white disabled:hover:cursor-wait"
        defaultValue={defaultValue}
      />
      <button
        className="disabled:hover:bg-white disabled:hover:cursor-wait disabled:opacity-55 hover:bg-gray-200 bg-white border px-3 h-8 -ml-[1px] rounded-r-md"
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
