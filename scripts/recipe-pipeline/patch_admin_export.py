import os

admin_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "components", "AdminDashboard.tsx"))

with open(admin_path, "r", encoding="utf-8") as f:
    c = f.read()

target = """        {/* TAB 1: CATALOG & BULK ACTIONS */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">"""

insert_block = """        {/* TAB 1: CATALOG & BULK ACTIONS */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Google Sheets & Excel Export Card */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-stone-900 to-amber-950/70 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-emerald-300">573 Master Recipes Google Sheet &amp; Costing Database</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      100% Ingested
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Na-extract mula sa Google Drive archive (32 subfolders). Kasama ang picture preview links, recipe ingredients, step-by-step instructions, at costing calculations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="/downloads/KusinaKita_573_Master_Recipes_GoogleSheet.csv"
                  download="KusinaKita_573_Master_Recipes_GoogleSheet.csv"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Google Sheet (CSV)</span>
                </a>
                <a
                  href="/downloads/KusinaKita_573_Ingredients_Costing_Matrix.csv"
                  download="KusinaKita_573_Ingredients_Costing_Matrix.csv"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ingredients Matrix</span>
                </a>
                <a
                  href="/downloads/KusinaKita_573_Complete_Recipe_Book.xlsx"
                  download="KusinaKita_573_Complete_Recipe_Book.xlsx"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel (.xlsx)</span>
                </a>
              </div>
            </div>"""

if target in c:
    c = c.replace(target, insert_block, 1)
    with open(admin_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("SUCCESS: Inserted Google Sheets export buttons in AdminDashboard.tsx")
else:
    print("WARNING: Target not found")
