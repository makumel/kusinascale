with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """        />
      </div>
    );
  }"""

replacement = """        />
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

if "currentPath === '/coffee-milktea'" not in text:
    text = text.replace(target, replacement, 1)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Inserted coffee-milktea route!")
