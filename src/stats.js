import { loadData } from "./loader";
import { calculateDeltas } from "./calculate";
import { visualize } from "./visualize";

loadData()
    .then(({data, yearCache}) => calculateDeltas(data, yearCache))
    .then(({completion_day_level, options}) => visualize(completion_day_level, options));
