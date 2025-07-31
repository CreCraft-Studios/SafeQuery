(function() {
    const bIsSearchPage = window.location.pathname.startsWith("/search.html");

    function search() {
        const query = document.getElementById("search_box").value;
        if (!bIsSearchPage)
            window.location.href=`search.html#q=${encodeURIComponent(query)}`;
        else {
            const params = new URLSearchParams(window.location.hash.substring(1));
            params.delete("q");
            params.set("q", encodeURIComponent(query));
            window.location.hash = `#${params.toString()}`;
        }
    }

    window.addEventListener("keydown", function(e) {
        if (e.key.toUpperCase()==="ENTER")
            search();
    });
    document.getElementById("search_btn").onclick = search;

    window.SQ_Search = search;
})();