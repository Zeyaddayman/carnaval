import { cache as react_cache } from "react";
import { getTopLevelCategories } from "./db/categories";

export const getCachedTopLevelCategories = react_cache(getTopLevelCategories)