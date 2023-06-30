import { create, insertMultiple, search } from "@orama/orama";

let resList = document.getElementById('searchResults');
let sInput = document.getElementById('searchInput');
let first, last, current_elem = null
let resultsAvailable = false;

function activeToggle(ae) {
    document.querySelectorAll('.focus').forEach(function (element) {
        // rm focus class
        element.classList.remove("focus")
    });
    if (ae) {
        ae.focus()
        document.activeElement = current_elem = ae;
        ae.parentElement.classList.add("focus")
    } else {
        document.activeElement.parentElement.classList.add("focus")
    }
}

function reset() {
    resultsAvailable = false;
    resList.innerHTML = sInput.value = ''; // clear inputbox and searchResults
    sInput.focus(); // shift focus to input box
}

window.addEventListener('load', async function () {
    // download index
    const posts = await fetch('/index.json').then((res) => res.json());

    // create index
    const db = await create({
        schema: {
            content: 'string',
            title: 'string',
        }
    });

    // add posts to index
    await insertMultiple(db, posts);

    // execute search as each character is typed
    sInput.addEventListener("keyup", async function (e) {
        const results = await search(db, {
            term: this.value.trim(),
            properties: "*",
            boost: {
                title: 2,
                content: 1,
            }
        });

        if (results.count > 0) {
            let resultSet = ''; // our results bucket
            for (const item of results.hits) {
                resultSet +=
                    `<li class="post-entry"><header class="entry-header">${item.document.title}&nbsp;»</header>` +
                    `<a href="${item.document.permalink}" aria-label="${item.document.title}"></a></li>`
            }

            resList.innerHTML = resultSet;
            resultsAvailable = true;
            first = resList.firstChild;
            last = resList.lastChild;
        } else {
            resultsAvailable = false;
            resList.innerHTML = '';
        }
    });

    sInput.addEventListener('search', function (e) {
        // clicked on x
        if (!this.value) reset()
    })

    // kb bindings
    document.addEventListener("keydown", function (e) {
        let key = e.key;
        let ae = document.activeElement;

        let inbox = document.getElementById("searchbox").contains(ae)

        if (ae === sInput) {
            let elements = document.getElementsByClassName('focus');
            while (elements.length > 0) {
                elements[0].classList.remove('focus');
            }
        } else if (current_elem) ae = current_elem;

        if (key === "Escape") {
            reset()
        } else if (!resultsAvailable || !inbox) {
            return
        } else if (key === "ArrowDown") {
            e.preventDefault();
            if (ae == sInput) {
                // if the currently focused element is the search input, focus the <a> of first <li>
                activeToggle(resList.firstChild.lastChild);
            } else if (ae.parentElement != last) {
                // if the currently focused element's parent is last, do nothing
                // otherwise select the next search result
                activeToggle(ae.parentElement.nextSibling.lastChild);
            }
        } else if (key === "ArrowUp") {
            e.preventDefault();
            if (ae.parentElement == first) {
                // if the currently focused element is first item, go to input box
                activeToggle(sInput);
            } else if (ae != sInput) {
                // if the currently focused element is input box, do nothing
                // otherwise select the previous search result
                activeToggle(ae.parentElement.previousSibling.lastChild);
            }
        } else if (key === "ArrowRight") {
            ae.click(); // click on active link
        }
    });
})