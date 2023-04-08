import { uniq } from 'lodash-es';
import { Document as FlexDocument } from '@akryum/flexsearch-es';

(async () => {
  // create indexer
  const index = new FlexDocument({
    doc: {
      id: 'id',
      field: ['title', 'category', 'tags', 'content'],
    },
  });

  // download index
  const posts = await fetch('/index.json').then((res) => res.json());
  posts.forEach((x) => index.add({ id: x.id, title: x.title, category: x.category, tags: x.tags, content: x.content }));

  // create date formatter
  const dateFormatter = new Intl.DateTimeFormat('id', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

  // enable the controls and add event listeners
  const textSearchInput = document.getElementById('textSearch');
  textSearchInput.removeAttribute('disabled');
  textSearchInput.setAttribute('placeholder', 'Ketik kata kunci pencarian...');
  textSearchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      searchHandler();
    }
  });

  const searchButton = document.getElementById('searchButton');
  searchButton.removeAttribute('disabled');
  searchButton.addEventListener('click', searchHandler);

  // search handler
  async function searchHandler() {
    // get the query
    const query = document.getElementById('textSearch')['value'];

    // get the search results
    const searchResult = uniq(index.search(query).flatMap((x) => x.result));

    // get and clear results
    const results = document.getElementById('results');
    results.innerHTML = '';

    // add search results to div
    searchResult.forEach((item) => {
      // get the document
      const doc = posts.find((x) => x.id === item);

      // create card
      const resultDiv = document.createElement('div');
      resultDiv.innerHTML = `
        <div class="mt-8">
          <h2 class="font-bold text-2xl sm:text-xl">
            <a href="${doc.uri}"">${doc.title}</a>
          </h2>
          <p class="mt-2 text-gray-600">
            ${dateFormatter.format(new Date(doc.date))}&nbsp;·
            <a class="capitalize hover:underline" href="/category/${doc.category}">
              ${doc.category}
            </a>
          </p>
          <ul class="text-sm mt-2">
            ${doc.tags
          .map(
            (tag) => `
                      <li class="bg-gray-100 dark:bg-slate-700 inline-block mr-2 mb-2 py-0.5 px-2 lowercase font-medium">
                        <a href="/tags/${tag}">${tag}</a>
                      </li>`
          )
          .join('')}
          </ul>
        </div>
    `;

      // append card to div
      results.appendChild(resultDiv);
    });
  }
})();
