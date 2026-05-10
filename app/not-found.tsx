import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinOff, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Background Aesthetic Number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="text-[30vw] font-black text-foreground tracking-tighter">
          404
        </span>
      </div>

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-md">
        {/* Japanese Thematic Element */}
        <div className="space-y-2">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-destructive/30 rounded-full text-destructive">
              <MapPinOff size={48} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            道に迷いましたか？
          </h1>
          <p className="text-lg font-medium text-muted-foreground">
            (Michi ni mayoimashita ka?)
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Sepertinya Anda tersesat dari rute belajar. Halaman yang Anda cari mungkin sudah dipindahkan atau tidak pernah ada.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto font-medium shadow-sm">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home size={18} />
              Kembali ke Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Beranda Utama
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
