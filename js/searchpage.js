(function() {
    var bHasGPSEInit=false;
    var bIsSafeApplied=false;

    function bisSearchAllowed(query) {
        return !blacklist.some(b=>query.toLowerCase().includes(b));
    }

    function blockedMessage(show) {
        if (show)
            document.getElementById("blockedMsg").setAttribute("style", "display: block !important;");
        else document.getElementById("blockedMsg").setAttribute("style", "display: none !important;");
    }

    function load() {
        var params = new URLSearchParams(window.location.hash.substring(1));
        var query = decodeURIComponent(params.get("q"));

        if (query==null || (query!=decodeURIComponent(params.get("gsc.q")) && params.get("gsc.q")!=null)) {
            window.location.href="index.html";
            return;
        }
    }

    function search() {
        var params = new URLSearchParams(window.location.hash.substring(1));
        var query = decodeURIComponent(params.get("q"));

        document.title = `${query} • SafeQuery`;
        document.getElementById("search_box").value=query;

        if (!bisSearchAllowed(query)) {
            blockedMessage(true);

            //This is only ment to remove the old search results before processing the new search in the event the query is blocked
            if (params.get("gsc.q")!=null) {
                try {
                    console.log("It's not null. REMOVE THE CHILDREN");
                    const wrapper = document.getElementsByClassName("gsc-expansionArea")[0];
                    if (wrapper!=null) {
                        if (wrapper.children.length>0) {
                            while(wrapper.children.length>0) {
                                wrapper.removeChild(wrapper.firstChild);
                            }
                        }
                    }

                    const branding = document.getElementsByClassName("gcsc-more-maybe-branding-root")[0];
                    if (branding!=null)
                        branding.remove();

                    const cursor = document.getElementsByClassName("gsc-cursor")[0];
                    if (cursor!=null)
                        cursor.remove();

                    document.getElementById("resInfo-0").innerText='';
                } catch(err) {
                    console.error(err);
                }
            } else console.log("It's null. Do nothing. The children are already dead");
        } else {
            blockedMessage(false);

            if (bHasGPSEInit)
                google.search.cse.element.getElement("searchresults-only0").execute(query);

            //Append safe=strict to google href link
            if (!bIsSafeApplied) {
                const int = setInterval(function() {
                    var brandRoot = document.getElementsByClassName("gcsc-more-maybe-branding-root")[0];
                    if (brandRoot == null)
                        brandRoot = document.getElementsByClassName("gcsc-more-maybe-branding-box")[0];

                    if (brandRoot!=null) {
                        const brandChild = brandRoot.children[0];
                        if (brandChild!=null) {
                            const url = `${brandChild.getAttribute("href")}&safe=strict`;
                            brandChild.setAttribute("href", url);
                            bIsSafeApplied=true;
                            clearInterval(int);
                        }
                    }
                }, 500);
            }
        }
    }

    function resizeBtn() {
        this.document.getElementById("search_btn").setAttribute("style", `height: ${this.document.getElementById("search_box").offsetHeight}px !important;`);
    }

    window.addEventListener("hashchange", function(){
        if (bHasGPSEInit)
            search();
    });
    window.addEventListener("DOMContentLoaded", function(){
        load();
        resizeBtn();
    });
    window.addEventListener("history_pushstate", search);
    window.addEventListener("history_replace", search);

    window.addEventListener("resize", resizeBtn);

    window.SQ_bSearchAllowed = bisSearchAllowed;

    window.__gcse = {
        callback: function() {
            bHasGPSEInit=true;
            search();
        }
    }

})();
