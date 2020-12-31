import { loadData } from "./loader";
import { calculateDeltas } from "./calculate";
import { visualize } from "./visualize";

loadData()
    .then(data => calculateDeltas(data))
    .then(completion_day_level => visualize(completion_day_level));
