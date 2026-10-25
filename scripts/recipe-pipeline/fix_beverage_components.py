with open('src/components/CoffeeMilkteaPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('r.size,', 'r.sizes[0].size,')
text = text.replace('r.recipeCost.toFixed(2),', 'r.sizes[0].recipeCost.toFixed(2),')
text = text.replace('r.packagingCost.toFixed(2),', 'r.sizes[0].packagingCost.toFixed(2),')
text = text.replace('r.laborCost.toFixed(2),', 'r.sizes[0].laborCost.toFixed(2),')
text = text.replace('r.totalCost.toFixed(2),', 'r.sizes[0].totalCost.toFixed(2),')
text = text.replace('r.walkinPrice.toFixed(2),', 'r.sizes[0].walkinPrice.toFixed(2),')
text = text.replace('r.walkinNetProfit.toFixed(2),', 'r.sizes[0].walkinNetProfit.toFixed(2),')
text = text.replace('r.foodPandaPrice.toFixed(2),', 'r.sizes[0].foodPandaPrice.toFixed(2),')
text = text.replace('(r.cogsRatio * 100).toFixed(1) + \'%\'', '(r.sizes[0].cogsRatio * 100).toFixed(1) + \'%\'')

text = text.replace('BEVERAGE_RECIPES', 'COFFEE_MILKTEA_RECIPES')
text = text.replace('selectedRecipeDetail.size', 'selectedRecipeDetail.sizes[0].size')
text = text.replace('selectedRecipeDetail.primaryIngredients', 'selectedRecipeDetail.sizes[0].primaryIngredients')
text = text.replace('selectedRecipeDetail.secondaryIngredients', 'selectedRecipeDetail.sizes[0].secondaryIngredients')

with open('src/components/CoffeeMilkteaPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/IntroSalesRecipePopup.tsx', 'r', encoding='utf-8') as f:
    text2 = f.read()

# Fix unused imports in IntroSalesRecipePopup
text2 = text2.replace('  Info,\n', '')
text2 = text2.replace('  BARISTA_GOLDEN_RULES,\n', '')
text2 = text2.replace('  onOpenCalculator,\n', '')
text2 = text2.replace('  onOpenCalculator\n', '')
text2 = text2.replace('  onOpenCalculator?: () => void;\n', '')

with open('src/components/IntroSalesRecipePopup.tsx', 'w', encoding='utf-8') as f:
    f.write(text2)

print("Updated CoffeeMilkteaPage and IntroSalesRecipePopup cleanly!")
