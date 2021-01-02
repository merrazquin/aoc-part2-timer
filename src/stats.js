import { loadData } from "./loader";
import { calculateDeltas } from "./calculate";
import { visualize } from "./visualize";

loadData()
    .then(({memberId, data, year, yearCache}) => calculateDeltas(memberId, data, year, yearCache))
    .then((completion_day_level) => visualize(completion_day_level));
