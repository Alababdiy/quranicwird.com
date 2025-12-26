"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Book, BookOpen, Search } from "lucide-react";
import quranData from "@/data/quran-index.json";

interface QuranIndexProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
}

export function QuranIndex({ isOpen, onClose, currentPage }: QuranIndexProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"surahs" | "juz">("surahs");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter surahs based on search query
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return quranData.surahs;

    const query = searchQuery.toLowerCase().trim();
    return quranData.surahs.filter((surah) => {
      return (
        surah.nameAr.includes(query) ||
        surah.nameEn.toLowerCase().includes(query) ||
        surah.number.toString().includes(query) ||
        surah.juz.toString().includes(query)
      );
    });
  }, [searchQuery]);

  // Filter juz based on search query
  const filteredJuz = useMemo(() => {
    if (!searchQuery.trim()) return quranData.juz;

    const query = searchQuery.toLowerCase().trim();
    return quranData.juz.filter((j) => {
      return (
        j.nameAr.includes(query) ||
        j.number.toString().includes(query)
      );
    });
  }, [searchQuery]);

  const goToPage = (page: number) => {
    const pageNum = String(page).padStart(3, "0");
    router.push(`/page/${pageNum}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            فهرس القرآن الكريم
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Close index"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن سورة أو جزء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-accent/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("surahs")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "surahs"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            السور
          </button>
          <button
            onClick={() => setActiveTab("juz")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "juz"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            الأجزاء
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "surahs" ? (
            <div className="grid gap-2">
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => goToPage(surah.page)}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-right ${
                    currentPage === surah.page ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {surah.number}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{surah.nameAr}</div>
                      <div className="text-xs text-muted-foreground">
                        {surah.verses} آية • الجزء {surah.juz}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ص {surah.page}
                  </div>
                </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد نتائج للبحث</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredJuz.length > 0 ? (
                filteredJuz.map((j) => (
                <button
                  key={j.number}
                  onClick={() => goToPage(j.startPage)}
                  className={`flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors text-right ${
                    currentPage >= j.startPage && currentPage <= j.endPage
                      ? "bg-accent"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {j.number}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{j.nameAr}</div>
                      <div className="text-xs text-muted-foreground">
                        {j.endPage - j.startPage + 1} صفحة
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ص {j.startPage} - {j.endPage}
                  </div>
                </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد نتائج للبحث</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
