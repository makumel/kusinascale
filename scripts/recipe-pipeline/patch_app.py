with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

bad_chunk = """  // Dedicated Route: Admin OS (/admin)
  if (currentPath === '/admin') {
    return (
      <div className="min-h-screen bg-stone-900 font-sans">
        <AdminDashboard
          onBackToStorefront={() => navigateTo('/')}
          onPreviewRecipe={(r) => {
            setSelectedRecipe(r);
            setModalInitialTab('recipe');
          }}
        />
        <RecipeModal
          recipe={selectedRecipe}
          initialTab={modalInitialTab}
          onClose={() => setSelectedRecipe(null)}
        />
      </div>
    );
  }
        />
      </div>
    );
  }"""

good_chunk = """  // Dedicated Route: Admin OS (/admin)
  if (currentPath === '/admin') {
    return (
      <div className="min-h-screen bg-stone-900 font-sans">
        <AdminDashboard
          onBackToStorefront={() => navigateTo('/')}
          onPreviewRecipe={(r) => {
            setSelectedRecipe(r);
            setModalInitialTab('recipe');
          }}
        />
        <RecipeModal
          recipe={selectedRecipe}
          initialTab={modalInitialTab}
          onClose={() => setSelectedRecipe(null)}
        />
      </div>
    );
  }

  // Dedicated Route: Coffee & Milk Tea Gated Commercial Package (/coffee-milktea)
  if (currentPath === '/coffee-milktea') {
    return (
      <div className="min-h-screen bg-[#faf8f5] font-sans">
        <CoffeeMilkteaPage
          onBackToCarinderia={() => navigateTo('/')}
        />
      </div>
    );
  }"""

text = text.replace(bad_chunk.replace('\n', '\r\n'), good_chunk.replace('\n', '\r\n'))
text = text.replace(bad_chunk, good_chunk)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed orphan tags and restored coffee-milktea route!")
