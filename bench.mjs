import {performance, PerformanceObserver} from "node:perf_hooks"
import {faker} from "@faker-js/faker"
import {create, insertMultiple, search} from "@orama/orama"

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks();
});
obs.observe({ type: 'measure' });

// function to print the used memory
function printUsedMemory() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}

// create fake data
performance.mark('create_fake_data_start');
const data = Array.from({length: 355000}, () => ({
  id: faker.string.uuid(),
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  fiscalCode: faker.string.alphanumeric({length: 16, casing: "uppercase"}),
  season: faker.number.int({min: 2010, max: 2020}),
}));
performance.measure('create_fake_data', 'create_fake_data_start');

printUsedMemory();

// create index and add data
performance.mark('create_index_start');
const db = await create({
  schema: {
    id: "string",
    name: "string",
    surname: "string",
    fiscalCode: "string",
    season: "number",
  },
});

await insertMultiple(db, data);
performance.measure('create_index', 'create_index_start')
console.log("Index created");

printUsedMemory();

// search the index
performance.mark('search_start');
const results = await search(db, {
  term: "john",
  properties: "*",
});
performance.measure('search', 'search_start')

console.log(results)
printUsedMemory();
