import { RECIPES } from '../../src/data/recipes';
import * as fs from 'fs';
import * as path from 'path';

const outPath = path.resolve('scripts/recipe-pipeline/recipes_dump.json');
fs.writeFileSync(outPath, JSON.stringify(RECIPES, null, 2), 'utf-8');
console.log(`Successfully dumped ${RECIPES.length} recipes to ${outPath}`);
